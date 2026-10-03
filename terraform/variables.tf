variable "environment" {
  description = "Ambiente de despliegue (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "aws_region" {
  description = "Región de AWS para desplegar la infraestructura"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nombre del proyecto"
  type        = string
  default     = "cell-inventory"
}

variable "db_name" {
  description = "Nombre de la base de datos PostgreSQL"
  type        = string
  default     = "device_inventory"
}

variable "db_username" {
  description = "Usuario administrador de la base de datos"
  type        = string
  default     = "postgresadmin"
}

variable "db_password" {
  description = "Contraseña de la base de datos"
  type        = string
  sensitive   = true
  default     = "SecurePass2026!Upt"
}

variable "backend_image_uri" {
  description = "URI de la imagen de contenedor del Backend (.NET Core)"
  type        = string
  default     = "ghcr.io/upt-faing-epis/cell-inventory-backend:latest"
}

variable "frontend_image_uri" {
  description = "URI de la imagen de contenedor del Frontend (React)"
  type        = string
  default     = "ghcr.io/upt-faing-epis/cell-inventory-frontend:latest"
}
