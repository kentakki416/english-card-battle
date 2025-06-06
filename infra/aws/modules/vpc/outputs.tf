output "vpc_id" {
  value       = aws_vpc.vpc.id
  description = "VPC ID"
}

output "security_group_ids" {
  value = {
    for sg_name, sg in aws_security_group.security_groups : sg_name => sg.id
  }
  description = "value = { for sg_name, sg in aws_security_group.security_groups : sg_name => sg.id }"
}

output "subnets" {
  value = {
    for key, subnet in aws_subnet.subnets :
    key => {
      id   = subnet.id
      cidr = subnet.cidr_block
      az   = subnet.availability_zone
    }
  }
}

output "security_groups" {
  value = {
    for key, sg in aws_security_group.security_groups :
    key => {
      id          = sg.id
      name        = sg.name
      description = sg.description
    }
  }
}
