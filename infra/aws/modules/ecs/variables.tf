variable "ecs_cluster" {
  type = object({
    name               = string
    capacity_providers = list(string)
  })
  default = {
    name               = "ecs-cluster"
    capacity_providers = ["FARGATE"]
  }
  description = "ECS Clusterを定義"
}

variable "log_group" {
  type = object({
    name              = string
    retention_in_days = number
  })
  default = {
    name              = "ecs-log-group"
    retention_in_days = 30
  }
  description = "Cloud Watch Log Groupを定義"
}

variable "iam" {
  type = object({
    role_name  = string
    policy_arn = set(string)
  })
  default = {
    role_name  = "ecs-task-execution-role"
    policy_arn = ["arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"]
  }
  description = "IAM Roleを定義"
}

variable "task_definition" {
  type = object({
    family                   = string
    network_mode             = string
    requires_compatibilities = list(string)
    cpu                      = string
    memory                   = string
    container_definitions = list(object({
      name      = string
      image     = string
      cpu       = number
      memory    = number
      essential = bool
      portMappings = list(object({
        containerPort = number
        hostPort      = number
        protocol      = string
      }))
      environment = list(object({
        name  = string
        value = string
      }))
      logConfiguration = object({
        logDriver = string
        options   = map(string)
      })
    }))
  })
  default = {
    family                   = "ecs-task-definition"
    network_mode             = "awsvpc"
    requires_compatibilities = ["FARGATE"]
    cpu                      = "256"
    memory                   = "512"
    container_definitions = [
      {
        name      = "ecs-container"
        image     = "nginx:latest"
        cpu       = 256
        memory    = 512
        essential = true
        portMappings = [
          {
            containerPort = 8080
            hostPort      = 8080
            protocol      = "tcp"
          }
        ]
        environment = [
          {
            name  = "ENV"
            value = "dev"
          }
        ]
        logConfiguration = {
          logDriver = "awslogs"
          options = {
            "awslogs-group"         = "ecs-log-group"
            "awslogs-region"        = "ap-northeast-1"
            "awslogs-stream-prefix" = "ecs"
          }
        }
      }
    ]
  }
  description = "ECS Task Definitionを定義"
}

### ECS Service Variables
variable "ecs_service" {
  type = object({
    name                               = string
    desired_count                      = number
    launch_type                        = string
    deployment_minimum_healthy_percent = number
    deployment_maximum_percent         = number
    network_configuration = object({
      subnets          = list(string)
      security_groups  = list(string)
      assign_public_ip = bool
    })
    load_balancer_enabled = bool
    load_balancer = optional(object({
      target_group_arn = string
      container_name   = string
      container_port   = number
      }), {
      target_group_arn = ""
      container_name   = ""
      container_port   = 0
    })
  })
  default = {
    name                               = "ecs-service"
    desired_count                      = 2
    launch_type                        = "FARGATE"
    deployment_minimum_healthy_percent = 20
    deployment_maximum_percent         = 100
    network_configuration = {
      subnets          = []
      security_groups  = []
      assign_public_ip = true
    }
    load_balancer_enabled = false
    load_balancer = {
      target_group_arn = ""
      container_name   = ""
      container_port   = 0
    }
  }
  description = "ECS Service configuration"
}

variable "cluster_name" {
  description = "ECS cluster name"
  type        = string
}

variable "task_definition_family" {
  description = "Task definition family name"
  type        = string
}

variable "cpu" {
  description = "CPU units for the task"
  type        = string
}

variable "memory" {
  description = "Memory for the task"
  type        = string
}

variable "container_name" {
  description = "Container name"
  type        = string
}

variable "container_image" {
  description = "Container image"
  type        = string
}

variable "container_port" {
  description = "Container port"
  type        = number
}

variable "service_name" {
  description = "ECS service name"
  type        = string
}

variable "desired_count" {
  description = "Desired number of running tasks"
  type        = number
  default     = 1
}

variable "network_configuration" {
  description = "Network configuration for ECS service"
  type = object({
    subnets          = list(string)
    security_groups  = list(string)
    assign_public_ip = bool
  })
}

variable "target_group_arn" {
  description = "Target group ARN for load balancer"
  type        = string
  default     = ""
}

variable "log_retention_in_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 7
}

variable "tags" {
  description = "Tags to apply to ECS resources"
  type        = map(string)
  default     = {}
}
