variable "project_name" {
  default = "teddy-shortener"
}

variable "db_password" {
  description = "Senha do banco de dados"
  type        = string
  sensitive   = true
  default     = "mude_me_12345"
}