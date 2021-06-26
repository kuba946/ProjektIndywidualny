


create database Projektowanie;
use Projektowanie;
create table Uzytkownik
(
IdUser int primary key identity (1,1),
NameUser nvarchar(100),
MailUser nvarchar(100),
PasswordUser nvarchar(100),
TypeUser nvarchar(100)
);
create table Project
(
IdProject int primary key identity (1,1),
NameProject nvarchar(100)
);
create table Issue
(
IdIssue int primary key identity (1,1),
NameIssue nvarchar(100),
IdProject int,
DescriptionIssue nvarchar(1000),
Status nvarchar(100),
IdUser int
constraint [FK_Issue_Project] foreign key (IdProject) references Project(IdProject),
constraint [FK_Issue_User] foreign key (IdUser) references Uzytkownik(IdUser)
);
create table UzytkownikProject
(
IdUserProject int primary key identity (1,1),
IdUser int,
IdProject int
constraint [FK_UserProject_User] foreign key (IdUser) references Uzytkownik(IdUser),
constraint [FK_UserProject_Project] foreign key (IdProject) references Project(IdProject)
);