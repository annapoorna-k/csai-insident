resource "azurerm_resource_group" "csai" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_container_registry" "csai" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.csai.name
  location            = azurerm_resource_group.csai.location
  sku                 = "Basic"

  admin_enabled = false
}

resource "azurerm_key_vault" "csai" {
  name                = var.key_vault_name
  location            = azurerm_resource_group.csai.location
  resource_group_name = azurerm_resource_group.csai.name

  tenant_id = data.azurerm_client_config.current.tenant_id
  sku_name  = "standard"

  purge_protection_enabled   = false
  soft_delete_retention_days = 7
}

data "azurerm_client_config" "current" {}

resource "azurerm_virtual_network" "csai" {
  name                = "vnet-csai"
  location            = azurerm_resource_group.csai.location
  resource_group_name = azurerm_resource_group.csai.name

  address_space = ["10.0.0.0/16"]
}

resource "azurerm_subnet" "vm" {
  name                 = "snet-vm"
  resource_group_name  = azurerm_resource_group.csai.name
  virtual_network_name = azurerm_virtual_network.csai.name

  address_prefixes = ["10.0.1.0/24"]
}

resource "azurerm_public_ip" "vm" {
  name                = "pip-csai"
  location            = azurerm_resource_group.csai.location
  resource_group_name = azurerm_resource_group.csai.name

  allocation_method = "Static"
  sku               = "Standard"
}

resource "azurerm_network_interface" "vm" {
  name                = "nic-csai"
  location            = azurerm_resource_group.csai.location
  resource_group_name = azurerm_resource_group.csai.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.vm.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.vm.id
  }
}

resource "azurerm_linux_virtual_machine" "csai" {
  name                = var.vm_name
  resource_group_name = azurerm_resource_group.csai.name
  location            = azurerm_resource_group.csai.location
  size                = var.vm_size

  admin_username = var.admin_username

  network_interface_ids = [
    azurerm_network_interface.vm.id
  ]

  disable_password_authentication = true

  admin_ssh_key {
    username   = var.admin_username
    public_key = var.ssh_public_key
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "ubuntu-24_04-lts"
    sku       = "server"
    version   = "latest"
  }
}

resource "azurerm_kubernetes_cluster" "csai" {
  name                = var.aks_name
  location            = azurerm_resource_group.csai.location
  resource_group_name = azurerm_resource_group.csai.name
  dns_prefix          = "aks-csai"

  default_node_pool {
    name       = "system"
    node_count = 2
    vm_size    = "Standard_B2s"
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin = "azure"
  }
}

resource "azurerm_role_assignment" "aks_acr" {
  principal_id                     = azurerm_kubernetes_cluster.csai.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                            = azurerm_container_registry.csai.id
  skip_service_principal_aad_check = true
}

