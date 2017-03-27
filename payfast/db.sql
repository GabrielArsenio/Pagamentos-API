drop table pagamentos;

CREATE TABLE pagamentos (
	id INT(6) AUTO_INCREMENT PRIMARY KEY,
	forma_de_pagamento VARCHAR(30) NOT NULL,
	descricao VARCHAR(30),
	valor DECIMAL(6, 2),
	moeda VARCHAR(5),
    status varchar(10),
    data TIMESTAMP
);