variable "subscription_id" {
  description = "Azure subscription ID"
  type        = string
  sensitive   = true
}

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
  description = "Azure VM size"
  type        = string
  default     = "Standard_B2s"
}

variable "admin_username" {
  description = "VM administrator username"
  type        = string
  default     = "azureadmin"
}

variable "ssh_public_key" {
  description = "SSH public key for the Azure VM"
  type        = string
}
