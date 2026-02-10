resource "aws_instance" "api_server" {
  ami           = "ami-09040d770ff222420"
  instance_type = "t3.micro"

  tags = {
    Name = "${var.project_name}-api"
  }
}

resource "aws_db_instance" "postgres" {
  allocated_storage    = 20
  engine               = "postgres"
  engine_version       = "15"
  instance_class       = "db.t3.micro"
  db_name              = "shortener"
  username             = "postgres"
  password             = var.db_password
  skip_final_snapshot  = true
  publicly_accessible  = true
}