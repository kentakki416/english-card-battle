variable "name" {
  description = "ALB name"
  type        = string
}

variable "internal" {
  description = "Whether ALB is internal"
  type        = bool
  default     = false
}

variable "security_groups" {
  description = "Security group IDs for ALB"
  type        = list(string)
}

variable "subnets" {
  description = "Subnet IDs for ALB"
  type        = list(string)
}

variable "enable_deletion_protection" {
  description = "Enable deletion protection"
  type        = bool
  default     = false
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "target_group_port" {
  description = "Target group port"
  type        = number
  default     = 80
}

variable "target_group_protocol" {
  description = "Target group protocol"
  type        = string
  default     = "HTTP"
}

variable "target_type" {
  description = "Target type"
  type        = string
  default     = "ip"
}

variable "listener_port" {
  description = "Listener port"
  type        = string
  default     = "80"
}

variable "listener_protocol" {
  description = "Listener protocol"
  type        = string
  default     = "HTTP"
}

variable "health_check" {
  description = "Health check configuration"
  type = object({
    enabled             = bool
    healthy_threshold   = number
    interval            = number
    matcher             = string
    path                = string
    port                = string
    protocol            = string
    timeout             = number
    unhealthy_threshold = number
  })
  default = {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }
}

variable "tags" {
  description = "Tags to apply to ALB resources"
  type        = map(string)
  default     = {}
}
