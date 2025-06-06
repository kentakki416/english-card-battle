### route table for igw
resource "aws_route_table" "route_table_igw" {
  count = var.create_internet_gateway ? 1 : 0

  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = "${var.name}-igw-rt"
  }
}

### route table detail for igw
resource "aws_route" "global_igw" {
  count = var.create_internet_gateway ? 1 : 0

  route_table_id         = aws_route_table.route_table_igw[count.index].id
  gateway_id             = aws_internet_gateway.igw[count.index].id
  destination_cidr_block = "0.0.0.0/0"
}

### route table for subnet
resource "aws_route_table" "route_tables" {
  for_each = var.route_tables
  vpc_id   = aws_vpc.vpc.id
  tags = {
    Name = "${var.name}-${each.key}-rt"
  }
}


### route table association
resource "aws_route_table_association" "route_table_associations" {
  for_each = var.route_tables

  subnet_id      = each.value.subnet_id
  route_table_id = each.value.route_table_id
}
