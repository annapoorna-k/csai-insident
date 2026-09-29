output "resource_group_name" {
  value = azurerm_resource_group.csai.name
}

output "vm_name" {
  value = azurerm_linux_virtual_machine.csai.name
}

output "vm_public_ip" {
  value = azurerm_public_ip.vm.ip_address
}

output "acr_name" {
  value = azurerm_container_registry.csai.name
}

output "acr_login_server" {
  value = azurerm_container_registry.csai.login_server
}

output "aks_name" {
  value = azurerm_kubernetes_cluster.csai.name
}

output "key_vault_name" {
  value = azurerm_key_vault.csai.name
}

