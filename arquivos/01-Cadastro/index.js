const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert'); // utilizado para comparacao de excessão
const bodyParser = require('body-parser');

let db = null;

const url = 'mongodb://localhost:27017';
const dbName = 'chatbotdb';

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({
    extended: false
});

// adicionando recursos ao express
app.use(jsonParser);
app.use(urlencodedParser);

// o parametro cliente contem a conexao
MongoClient.connect(url, { useNewUrlParser: true }, function(err, client){
    // se o erro não for nulo, irá gerar uma excessão
    assert.equal(null, err);
    console.log('Banco de dados conectado com sucesso!');
    db = client.db(dbName);
});

app.listen(3000);
console.log('Servidor executando!');


app.post('/chatbot/insert', urlencodedParser, function(req, res){
    let objJSON = {};

    // verifica se possui usuario
    if(req.body.code_user)
        objJSON.code_user = req.body.code_user;
    else
        objJSON.code_user = 0;

    // verifica se usuário está ativo
    if(req.body.activate)
        objJSON.activate = req.body.activate;
    else
        objJSON.activate = true;

    // armazena o codigo da pergunta com a resposta que sera cadastrada
    if(req.body.code_current)
        objJSON.code_current = req.body.code_current;
    else
        objJSON.code_current = cod();

    // codigo da ultima pergunta que foi feita
    if(req.body.code_before)
        objJSON.code_before = req.body.code_before;
    else
        objJSON.code_before = 0;

    if(req.body.code_relation)
        objJSON.code_relation = req.body.code_relation;
    else
        objJSON.code_relation = 0;

    // referente a pergunta
    if(req.body.input)
        objJSON.input = req.body.input;
    else
        objJSON.input = '';

    // referente a resposta
    if(req.body.output)
        objJSON.output = req.body.output;
    else
        objJSON.output = 'Desculpe, não entendi.';

    insertData(objJSON, function(result){
        res.send(result);
    });
});


app.post('/user/insert', urlencodedParser, function(req, res){
    let objJSON = {};

    // verifica se possui usuario
    if(req.body.code_user)
        objJSON.code_user = req.body.code_user;
    else
        objJSON.code_user = cod();

    // verifica se usuário está ativo
    if(req.body.activate)
        objJSON.activate = req.body.activate;
    else
        objJSON.activate = true;

    if(req.body.full_name)
        objJSON.full_name = req.body.full_name;
    else
        objJSON.full_name = '';

    if(req.body.user_name)
        objJSON.user_name = req.body.user_name;
    else
        objJSON.user_name = '';

    if(req.body.email)
        objJSON.email = req.body.email;
    else
        objJSON.email = '';

    if(req.body.password)
        objJSON.password = req.body.password;
    else
        objJSON.password = '';

    insertUser(objJSON, function(result){
        res.send(result);
    });
});



app.post('/chatbot/update', urlencodedParser, function(req, res){
    let objJSON = {};

    // verifica se possui usuario
    if(req.body.code_user)
        objJSON.code_user = req.body.code_user;

    // verifica se usuário está ativo
    if(req.body.activate)
        objJSON.activate = req.body.activate;

    // armazena o codigo da pergunta com a resposta que sera cadastrada
    if(req.body.code_current)
        objJSON.code_current = req.body.code_current;

    // codigo da ultima pergunta que foi feita
    if(req.body.code_before)
        objJSON.code_before = req.body.code_before;

    if(req.body.code_relation)
        objJSON.code_relation = req.body.code_relation;

    // referente a pergunta
    if(req.body.input)
        objJSON.input = req.body.input;

    // referente a resposta
    if(req.body.output)
        objJSON.output = req.body.output;

    updateData(objJSON, function(result){
        res.send(result);
    });
});

app.post('/user/update', urlencodedParser, function(req, res){
    let objJSON = {};

    // verifica se possui usuario
    if(req.body.code_user)
        objJSON.code_user = req.body.code_user;

    // verifica se usuário está ativo
    if(req.body.activate)
        objJSON.activate = req.body.activate;

    if(req.body.full_name)
        objJSON.full_name = req.body.full_name;

    if(req.body.user_name)
        objJSON.user_name = req.body.user_name;

    if(req.body.email)
        objJSON.email = req.body.email;

    if(req.body.password)
        objJSON.password = req.body.password;

    updateUser(objJSON, function(result){
        res.send(result);
    });
});

app.post('/chatbot/delete', urlencodedParser, function(req, res){
    let objJSON = {};

    // verifica se possui usuario
    if(req.body.code_user)
        objJSON.code_user = req.body.code_user;

    // verifica se usuário está ativo
    if(req.body.activate)
        objJSON.activate = req.body.activate;

    // armazena o codigo da pergunta com a resposta que sera cadastrada
    if(req.body.code_current)
        objJSON.code_current = req.body.code_current;

    // codigo da ultima pergunta que foi feita
    if(req.body.code_before)
        objJSON.code_before = req.body.code_before;

    if(req.body.code_relation)
        objJSON.code_relation = req.body.code_relation;

    // referente a pergunta
    if(req.body.input)
        objJSON.input = req.body.input;

    // referente a resposta
    if(req.body.output)
        objJSON.output = req.body.output;

    deleteData(objJSON, function(result){
        res.send(result);
    });
});

app.post('/user/delete', urlencodedParser, function(req, res){
    let objJSON = {};

    // verifica se possui usuario
    if(req.body.code_user)
        objJSON.code_user = req.body.code_user;

    // verifica se usuário está ativo
    if(req.body.activate)
        objJSON.activate = req.body.activate;

    if(req.body.full_name)
        objJSON.full_name = req.body.full_name;

    if(req.body.user_name)
        objJSON.user_name = req.body.user_name;

    if(req.body.email)
        objJSON.email = req.body.email;

    if(req.body.password)
        objJSON.password = req.body.password;

    deleteUser(objJSON, function(result){
        res.send(result);
    });
});


app.post('/chatbot/find', urlencodedParser, function(req, res){
    let objJSON = {};

    // verifica se possui usuario
    if(req.body.code_user)
        objJSON.code_user = req.body.code_user;

    // verifica se usuário está ativo
    if(req.body.activate)
        objJSON.activate = req.body.activate;

    // armazena o codigo da pergunta com a resposta que sera cadastrada
    if(req.body.code_current)
        objJSON.code_current = req.body.code_current;

    // codigo da ultima pergunta que foi feita
    if(req.body.code_before)
        objJSON.code_before = req.body.code_before;

    if(req.body.code_relation)
        objJSON.code_relation = req.body.code_relation;    

    // referente a pergunta
    if(req.body.input)
        objJSON.input = req.body.input;

    // referente a resposta
    if(req.body.output)
        objJSON.output = req.body.output;

    findData(objJSON, function(result){
        res.send(result);
    });
});

app.post('/user/find', urlencodedParser, function(req, res){
    let objJSON = {};

    // verifica se possui usuario
    if(req.body.code_user)
        objJSON.code_user = req.body.code_user;

    // verifica se usuário está ativo
    if(req.body.activate)
        objJSON.activate = req.body.activate;

    if(req.body.full_name)
        objJSON.full_name = req.body.full_name;

    if(req.body.user_name)
        objJSON.user_name = req.body.user_name;

    if(req.body.email)
        objJSON.email = req.body.email;

    if(req.body.password)
        objJSON.password = req.body.password;

    findUser(objJSON, function(result){
        res.send(result);
    });
});

app.post('/user/activate/true', urlencodedParser, function(req, res){
    let objJSON = {};

    // verifica se possui usuario
    if(req.body.code_user)
        objJSON.code_user = req.body.code_user;
    else
        objJSON.code_user = 0;

    activateUserTrue(objJSON, function(result){
        res.send(result);
    });
});

app.post('/user/activate/false', urlencodedParser, function(req, res){
    let objJSON = {};

    // verifica se possui usuario
    if(req.body.code_user)
        objJSON.code_user = req.body.code_user;
    else
        objJSON.code_user = 0;

    activateUserFalse(objJSON, function(result){
        res.send(result);
    });
});

app.post('/user/delete/all', urlencodedParser, function(req, res){
    let objJSON = {};

    // verifica se possui usuario
    if(req.body.code_user)
        objJSON.code_user = req.body.code_user;
    else
        objJSON.code_user = 0;  

    deleteUserAll(objJSON, function(result){
        res.send(result);
    });
});

app.get('/chatbot/question', urlencodedParser, function(req, res){
    let objJSON = {};

    // req.query: parametro passado na URL
    if(req.query.code_user)
        objJSON.code_user = Number(req.query.code_user);
    else
        objJSON.code_user = 0;

    // verifica se usuário está ativo
    if(req.body.activate)
        objJSON.activate = req.body.activate;
    else
        objJSON.activate = true;

    if(req.query.code_before)
        objJSON.code_before = Number(req.query.code_before);
    else
        objJSON.code_before = 0;

    if(req.query.code_relation)
        objJSON.code_relation = Number(req.query.code_relation);
    else
        objJSON.code_relation = 0;

    if(req.query.input)
        objJSON.input = req.query.input;
    else
        objJSON.input = '';

    questionData(objJSON, function(result){
        res.send(result);
    });
});

const questionData = function(objJSON, callback){
    const collection = db.collection('chatbot');
    collection.find(objJSON).toArray(function(err, result){
        // se existir algum erro, uma excessao sera lancada
        assert.equal(null, err);

        // se nao encontrou nenhum registro com o objeto informado, busca por usuario
        if(result.length <= 0){
            let code_before = Number(objJSON.code_before);
            let objFind = {};

            if(code_before > 0){
                objFind = {
                    code_user: objJSON.code_user,
                    code_relation: code_before
                };
            }else{
                objFind = {
                    code_user: objJSON.code_user
                };
            }

            collection.find(objFind).toArray(function(err, result){
                assert.equal(null, err);
                
                if(result <= 0){
                    collection.find({ code_user: objJSON.code_user }).toArray(function(err, result){
                        // natural language processing (algoritmo de IA utilizado no tratamento de textos)
                        result = nlp(objJSON.input, result);
                        callback(result);
                    });
                }
                else{
                    // natural language processing (algoritmo de IA utilizado no tratamento de textos)
                    result = nlp(objJSON.input, result);
                    callback(result);
                }
            });
        }
        else
        {
            callback(result);
        }
    });
};

// question: pergunta feita ao chatbot
// array: objetos da consulta que sera feita
const nlp = function(question, array){
    let originalQuestion = question.toString().trim();
    let findInput = 0; // quantidade de ocorrencias encontradas para a pergunta feita
    let findIndex = 0; // indice da resposta encontrada para a pergunta feita

    let documents = getDocuments(originalQuestion);
    if(documents){
        return [{
            '_id': 0,
            'code_user': -1,
            'activate': true,
            'code_current': -1,
            'code_relation': -1,
            'code_before': -1,
            'input': originalQuestion,
            'output': 'Ok, entendido.'
        }];
    }else{
        for(let i = 0; i < array.length; i++){
            question = question.toString().trim();
            let input = array[i].input.toString().trim();
    
            if(input.length <= 0)
                input = array[i].output.toString().trim();
    
            // normalize('NFD'): faz com que cada caractere da string seja tratado individualmente
            // expressao regular de A - Z, para remover acentos (por isso esta usando u0300 e u0360f - ASCII nao convencional)
            // se estivesse usando o caractere em si, todo ele seria substituido por vazio, ao inves de remover os devidos acentos
            question = question.normalize('NFD').replace(/[\u0300-\u0360f]/g, '').toLowerCase();
            
            // remove caracteres nao-alfanumericos
            // \s: caracteres de espaco
            question = question.replace(/[^a-zA-Z0-9\s]/g, '');
    
            input = input.normalize('NFD').replace(/[\u0300-\u0360f]/g, '').toLowerCase();
            input = input.replace(/[^a-zA-Z0-9\s]/g, '');
    
            // tokenizar e transformar cada palavra de uma string em elementos de um array
            let tokenizationQuestion = question.split(' ');
            let tokenizationInput = input.split(' ');
    
            // metodo map percorre cada elemento do array
            // e: cada elemento do array
            tokenizationQuestion = tokenizationQuestion.map(function(e){
                if(e.length > 3){
                    // ignora os ultimos 3 caracteres para nao considerar o tempo verbal das palavras
                    // ex: coloCAR, coloCOU
                    return e.substr(0, e.length - 3)
                }
                else
                {
                    return e;
                }
            });
    
            tokenizationInput = tokenizationInput.map(function(e){
                if(e.length > 3){
                    // ignora os ultimos 3 caracteres para nao considerar o tempo verbal das palavras
                    // ex: coloCAR, coloCOU
                    return e.substr(0, e.length - 3)
                }
                else
                {
                    return e;
                }
            });
    
            let words = 0;
            for(let x = 0; x < tokenizationQuestion.length; x++){
                // se a palavra constar em uma das perguntas
                if(tokenizationInput.indexOf(tokenizationQuestion[x]) >= 0)
                    words++;
            }
    
            if(words > findInput){
                findInput = words;
                findIndex = i;
            }
        }
    
        // se alguma resposta foi encontrada
        if(findInput > 0){
            return [{
                '_id': array[findIndex]._id,
                'code_user': array[findIndex].code_user,
                'activate': array[findIndex].activate,
                'code_current': array[findIndex].code_current,
                'code_relation': array[findIndex].code_relation,
                'code_before': array[findIndex].code_before,
                'input': originalQuestion,
                'output': array[findIndex].output
            }];
        }
        else{
            return [{
                '_id': 0,
                'code_user': array[findIndex].code_user,
                'activate': array[findIndex].activate,
                'code_current': array[findIndex].code_current,
                'code_relation': array[findIndex].code_relation,
                'code_before': array[findIndex].code_before,
                'input': originalQuestion,
                'output': 'Não sei te responder.'
            }];
        }
    }
};


function cod(){
    const data = new Date();
    const ano = data.getFullYear();
    const mes = data.getMonth();
    const dia = data.getDate();
    const hora = data.getHours();
    const minuto = data.getMinutes();
    const segundo = data.getSeconds();
    const milisegundos = data.getMilliseconds();
    const result = Number(parseFloat(Number(ano+''+mes+''+dia+''+hora+''+minuto+''+segundo+''+milisegundos) / 2).toFixed(0));

    return result;
}

const getDocuments = function(question = ''){
    question = question.toString().trim();
    let _nome = getName(question);
    let _idade = getYears(question);
    let _email = '';
    let _celular = '';
    let _telefone = '';
    let _cep = '';
    let _cpf = '';
    let _cnpj = '';

    const questionTokens = question.split('');
    for(let i = 0; i < questionTokens.length; i++){
        let word = questionTokens[i].toString().trim();

        if(word.length >= 1){
            if(_email.length <= 0) _email = email(word);
            if(_celular.length <= 0) _celular = celular(word);
            if(_telefone.length <= 0) _telefone = telefone(word);
            if(_cep.length <= 0) _cep = cep(word);
            if(_cpf.length <= 0) _cpf = cpf(word);
            if(_cnpj.length <= 0) _cnpj = cnpj(word);
        }

        console.log('_nome: ' + _nome);

        let objJSON = {};
        if(_nome.length > 0) objJSON.nome = _nome; else objJSON.nome = '';
        if(_idade.length > 0) objJSON.nome = Number(_idade); else objJSON.idade = '';
        if(_email.length > 0) objJSON.email = _email; else objJSON.email = '';
        if(_celular.length > 0) objJSON.celular = _celular; else objJSON.celular = '';
        if(_telefone.length > 0) objJSON.telefone = _telefone; else objJSON.telefone = '';
        if(_cep.length > 0) objJSON.cep = _cep; else objJSON.cep = '';
        if(_cpf.length > 0) objJSON.cpf = _cpf; else objJSON.cpf = '';
        if(_cnpj.length > 0) objJSON.cnpj = _cnpj; else objJSON.cnpj = '';

        // se nao encontrar nenhum dos valores capturados, retorna falso
        if((
            _nome.length > 0) ||
            (_idade.length > 0) ||
            (_email.length > 0) ||
            (_celular.length > 0) ||
            (_telefone.length > 0) ||
            (_cep.length > 0) ||
            (_cpf.length > 0) ||
            (_cnpj.length > 0)
        ){
            const collection = db.collection('documents');
            collection.insertOne(objJSON);
            return true;
        }else{
            return false;
        }
    }
}

const getName = function(question = ''){  
    question = question.toString().trim();
    let nome = '';
    let start = '';

    // testa se o usuario informou o nome, utilizando uma das palavras abaixo
    // ex: eu me chamo... meu nome é... Nome: Gabriel...
    if(question.indexOf('Nome') >= 0) start = 'Nome';
    if(question.indexOf('nome') >= 0) start = 'nome';

    // eu me chamo...
    if(question.indexOf('chamo') >= 0) start = 'chamo';

    if((start.length > 0) && (question.indexOf('seu') < 0)){
        let indexStart = question.indexOf(start) + start.length + 1;
        let end = '';

        if(question.indexOf(' e ') >= 0 && question.indexOf(' e ') > indexStart)
            end = ' e ';
        else if(question.indexOf(',') >= 0 && question.indexOf(',') > indexStart)
            end = ',';
        else if(question.indexOf(';') >= 0 && question.indexOf(';') > indexStart)
            end = ';';
        else if(question.indexOf('.') >= 0 && question.indexOf('.') > indexStart)
            end = '.';

        let indexEnd = question.indexOf(end);
        if(indexEnd < indexStart)
            indexEnd = question.length;

        nome = question.substring(indexStart, indexEnd);
        nome = nome.replace(/é/g, '');
        nome = nome.replace(/:/g, '');
        nome = nome.replace(/[0-9]]/g, '').trim();

        return nome;
    }

    return '';
}

const getYears = function(question = ''){
    question = question.toString().trim();
    //   \s: caracter de espaco
    question = question.replace(/[^0-9a-zA-Z\s]/g, '');

    let idade = '';
    if(question.indexOf('anos') > 0){
        let arr = question.split(' ');

        // palavra anterior a palavra ANOS, que provavelmente e a idade
        // ex: eu tenho xx anos
        let anos = arr[arr.indexOf('anos') - 1];

        if(Number(anos) > 0 && Number(anos) < 125)
            idade = anos;

        return idade;
    }

    return 0;
}

const email = function(_email = ''){
    _email = _email.toString().trim();
    _email = _email.replace('/[^0-9a-zA-Z@.-_]/g', '')
    if(_email.indexOf('@') > 0 && _email.indexOf('.') > 0 && _email.length >= 5)
        return _email;
    else
        return '';
}

const celular = function(_celular = ''){
    _celular = _celular.toString().trim();
    _celular = _celular.replace(/[^0-9]/g), '';

    if(_celular.indexOf('55') == 0)
        _celular.replace('55', '');

    let _cpf = cpf(_celular);

    if(_celular.length == 1 && _cpf.length <= 0 && _celular.indexOf('9') > 0)
        return _celular;
    else
        return '';
}

const telefone = function(_telefone){
    _telefone = _telefone.toString().trim();
    _telefone = _telefone.replace(/[^0-9]/g, '');

    if(_telefone.indexOf('55') == 0)
        _telefone = _telefone.replace('55', '');

    if(_telefone.length == 10)
        return _telefone;
    else
        return '';
}

const cep = function(_cep = ''){
    _cep = _cep.toString().trim();
    _cep = _cep.replace(/[^0-9]/g, '');

    if(_cep.length != 8)
        return '';
    else
        return _cep;

}

const cpf = function(_cpf){
    // o D maiusculo significa caracteres nao numericos
    _cpf = _cpf.toString().trim().replace(/\D/g, '');

    if(_cpf.toString().length != 11)
        return '';  

    let result = _cpf;
        
        // aqui teria uma validacao de CPF, mas nao vou fazer no momento

    return '85706320020';
}

const cnpj = function(_cnpj){
    // d minusculo significa caracteres numericos
    _cnpj = _cnpj.toString().trim().replace(/^\d/g, '');

    if(_cnpj.toString().length != 14)
        return '';  

    let result = _cnpj;
    
    // aqui teria uma validacao de cnpj, mas nao vou fazer no momento

    return '93056824000164';
}

const insertData = function(objJSON, callback){
    // collection e uma tabela
    const collection = db.collection('chatbot');
    collection.insertOne(objJSON, function(err, result){
        assert.equal(null, err);
        callback(result);
    });
};

const updateData = function(objJSON, callback){
    // collection e uma tabela
    const collection = db.collection('chatbot');
    const code_current = objJSON.code_current;

    // primeiro parametro: id do registro
    // segundo parametro: campos que deverao ser atualizados (no caso os campos que estao no objJSON)
    collection.updateOne({code_current: code_current}, {$set: objJSON}, function(err, result){
        assert.equal(null, err);
        callback(result);
    });
};

const deleteData = function(objJSON, callback){
    // collection e uma tabela
    const collection = db.collection('chatbot');

    // primeiro parametro: id do registro
    // const code_current = objJSON.code_current;
    // collection.deleteOne({code_current: code_current}, function(err, result){
    collection.deleteOne(objJSON, function(err, result){
        assert.equal(null, err);
        callback(result);
    });
};

const findData = function(objJSON, callback){
    // collection e uma tabela
    const collection = db.collection('chatbot');
    collection.find(objJSON).toArray(function(err, result){
        assert.equal(null, err);
        callback(result);
    });
};


// user

const insertUser = function(objJSON, callback){
    // collection e uma tabela
    const collection = db.collection('user');
    collection.insertOne(objJSON, function(err, result){
        assert.equal(null, err);
        callback(result);
    });
};

const updateUser = function(objJSON, callback){
    // collection e uma tabela
    const collection = db.collection('user');
    const code_user = objJSON.code_user;

    // primeiro parametro: id do registro
    // segundo parametro: campos que deverao ser atualizados (no caso os campos que estao no objJSON)
    collection.updateOne({code_user: code_user}, {$set: objJSON}, function(err, result){
        assert.equal(null, err);
        callback(result);
    });
};

const deleteUser = function(objJSON, callback){
    // collection e uma tabela
    const collection = db.collection('user');

    // primeiro parametro: id do registro
    // const code_current = objJSON.code_current;
    // collection.deleteOne({code_current: code_current}, function(err, result){
    collection.deleteOne(objJSON, function(err, result){
        assert.equal(null, err);
        callback(result);
    });
};

const deleteUserAll = function(objJSON, callback){
    // collection e uma tabela
    const collection = db.collection('chatbot');

    // primeiro parametro: id do registro
    // const code_current = objJSON.code_current;
    // collection.deleteOne({code_current: code_current}, function(err, result){
    collection.deleteMany(objJSON, function(err, result){
        assert.equal(null, err);
        callback(result);
    });
};

const findUser = function(objJSON, callback){
    // collection e uma tabela
    const collection = db.collection('user');
    collection.find(objJSON).toArray(function(err, result){
        assert.equal(null, err);
        callback(result);
    });
};


const activateUserTrue = function(objJSON, callback){
    // collection e uma tabela
    const collection = db.collection('chatbot');
    const code_user = objJSON.code_user;

    // primeiro parametro: id do registro
    // segundo parametro: campos que deverao ser atualizados (no caso os campos que estao no objJSON)
    collection.updateMany({code_user: code_user}, {$set: { activate: true }}, function(err, result){
        assert.equal(null, err);
        callback(result);
    });
};

const activateUserFalse = function(objJSON, callback){
    // collection e uma tabela
    const collection = db.collection('chatbot');
    const code_user = objJSON.code_user;

    // primeiro parametro: id do registro
    // segundo parametro: campos que deverao ser atualizados (no caso os campos que estao no objJSON)
    collection.updateMany({code_user: code_user}, {$set: { activate: false }}, function(err, result){
        assert.equal(null, err);
        callback(result);
    });
};