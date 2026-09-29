variable "location" {
  description = "Azure region"
  type        = string
  default     = "Central India"
}

variable "resource_group_name" {
  description = "Resource group name"
  type        = string
  default     = "rg-csai"
}

variable "vm_name" {
  description = "Virtual machine name"
  type        = string
  default     = "csai"
}

variable "acr_name" {
  description = "Azure Container Registry name"
  type        = string
  default     = "acrcsai"
}

variable "aks_name" {
  description = "AKS cluster name"
  type        = string
  default     = "aks-csai"
}

variable "key_vault_name" {
  description = "Azure Key Vault name"
  type        = string
  default     = "csai-keys"
}

variable "vm_size" {
  type    = string
  default = "Standard_B2s"
}

variable "admin_username" {
  type    = string
  default = "azureadmin"
}

variable "ssh_public_key" {
  description = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGEvdrbNkiDBoBtnaZxdBVjythBEgNjsM+L958Sp6bAL csai"
  type        = string
}

