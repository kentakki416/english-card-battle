variable "name" {
  type        = string
  description = "VPC name"
}

variable "cidr_block" {
  type        = string
  description = "VPCのCIDRブロック"
}

variable "enable_dns_support" {
  type        = bool
  default     = true
  description = "DNSサポートを有効にするかどうか"
}

variable "enable_dns_hostnames" {
  type        = bool
  default     = true
  description = "DNSホスト名を有効にするかどうか"
}

variable "subnets" {
  type = map(object({
    cidr_block              = string
    availability_zone       = string
    subnet_type             = string # public or private
    route_tables            = optional(set(string), [])
    vpc_interface_endpoints = optional(set(string), [])
  }))
  default     = {}
  description = "subnetsを定義"
}

variable "create_internet_gateway" {
  type        = bool
  default     = true
  description = "インターネットゲートウェイを作成するかどうか"
}

variable "route_tables" {
  type = map(object({
    global_type           = string
    vpc_gateway_endpoints = optional(set(string), [])
    subnet_id             = string
    route_table_id        = string
  }))
  default = {
  }
  description = "route tableを定義"
}

variable "vpc_interface_endpoints" {
  type = map(object({
    security_groups     = optional(list(string))
    private_dns_enabled = optional(bool, true)
  }))
  default     = {}
  description = "VPCエンドポイントを定義"
}

variable "vpc_gateway_endpoints" {
  type = map(object({
    route_tables = optional(set(string), [])
  }))
  default     = {}
  description = "VPCゲートウェイエンドポイントを定義"
}

variable "security_groups" {
  type = map(object({
    name        = string
    description = string
  }))
  default     = {}
  description = "security groupを定義"
}

variable "security_group_rules" {
  type = list(object({
    security_group_name        = string
    type                       = string
    from_port                  = number
    to_port                    = number
    protocol                   = string
    cidr_blocks                = optional(list(string), null)
    source_security_group_name = optional(string, null)
    description                = optional(string, null)
  }))
  default     = []
  description = "security group ruleを定義"
}
