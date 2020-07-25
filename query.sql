create table location
(
    id serial not null primary key, 
    country varchar(100),
    city varchar(100),
    street varchar(200)
    
)

create table users
(
    user_id serial not null primary key, 
    username varchar(255) not null unique,
    password varchar(255) not null,
    first_name varchar(255) not null,
    last_name varchar(255) not null,
    mail varchar(255) not null,
    location_id int not null,
    CONSTRAINT fk_location
      FOREIGN KEY(location_id) 
	  REFERENCES location(id)
      ON DELETE SET NULL
    
)

create table projects
(
    project_id serial not null primary key, 
    name varchar(255) not null unique,
    description text not null,
    status varchar(100),
    funds int,
    creator_id int not null,
    creation_date date,
    location_id int ,
    CONSTRAINT fk_creator
      FOREIGN KEY(creator_id) 
	  REFERENCES users(user_id)
      ON DELETE CASCADE,
    CONSTRAINT fk_locationp
      FOREIGN KEY(location_id) 
	  REFERENCES location(id)
    ON DELETE SET NULL
)

create table forum
(
    msg_id serial not null primary key, 
    message text not null,
    user_id int not null,
    project_id int not null, 
    CONSTRAINT fk_project
      FOREIGN KEY(project_id) 
	  REFERENCES projects(project_id)
      ON DELETE CASCADE,  
    CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	  REFERENCES users(user_id)
    ON DELETE SET NULL
)

create table adherents
(
    user_id int not null , 
    project_id int not null,
    add_date date,
    amount_given int,
    CONSTRAINT fk_project_adh
      FOREIGN KEY(project_id) 
	  REFERENCES projects(project_id)
      ON DELETE CASCADE,  
    CONSTRAINT fk_user_adh
      FOREIGN KEY(user_id) 
	  REFERENCES users(user_id)
    ON DELETE SET NULL
)

