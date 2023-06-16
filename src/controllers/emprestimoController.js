import Emprestimo from "../models/Emprestimo";
import EmprestimoLivro from "../models/EmprestimoLivro";
import Livro from "../models/Livro";
import { sequelize } from "../config/config";
import { Op } from "sequelize";

const getAll = async (req, res) =>{
  try {
      const emprestimos = await Emprestimo.findAll()
      let response = []
      for (let emprestimo of emprestimos) {
        let livros = await emprestimo.getLivros()
        emprestimo = emprestimo.toJSON()
        emprestimo.livros = livros
        response.push(emprestimo)
      }
      return res.status(200).send(response)
  } catch (error) {
    return res.status(500).send({
      message: error.message
    })
  }
}



const getById = async (req, res) => {
  try {
    let { id } = req.params;

    id = id ? id.toString().replace(/\D/g, '') : null;
    if (!id) {
      return res.status(400).send({
        message: 'Informe um id válido para consulta'
      });
    }

    let emprestimo = await Emprestimo.findOne({
      where: {
        id
      }
    });

    if (!emprestimo) {
      return res.status(400).send({
        message: `Não foi encontrado emprestimo com o id ${id}`
      });
    }

    let response = emprestimo.toJSON();
    response.livros = await emprestimo.getLivros({
      attributes: ['id', 'titulo'],
    });

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({
      message: error.message
    })
  }
}

const persistir = async (req, res) => {
  try {
    let { id } = req.params;
    if (!id) {
      return await create(req.body, res)
    }

    return await update(id, req.body, res)
  } catch (error) {
    return res.status(500).send({
      message: error.message
    })
  }
}


const create = async (dados,res) =>{
  let { prazo, devolucao, idUsuario, livros} = dados;

  let emprestimo = await Emprestimo.create({
    prazo, devolucao, idUsuario
  })

  for (let index = 0; index < livros.length; index++) {
    
    let livroExistente = await Livro.findOne({
      where: {
        id: livros[index]
      }
    })

    if(!livroExistente){
      await emprestimo.destroy()
      return res.status(400).send({
        message: `O livro id ${livros[index]} não existe. O empréstimo não foi salvo!!`
      })
    }

    let livroEmprestado = await sequelize.query(`
      select
        id_emprestimo as id
      from emprestimo_livros as el
      inner join emprestimos as e on (e.id = el.id_emprestimo)
      where e.devolucao is null and el.id_livro = ${livros[index]}
    `)


    if(livroEmprestado[1].rowCount){
      await emprestimo.destroy()
      livroEmprestado = livroEmprestado[0][0]? livroEmprestado[0][0].id : ''
      return res.status(200).send({
        type: 'error',
        message: `O livro id ${livros[index]} já está emprestado no empréstimo ${livroEmprestado}. O empréstimo não foi salvo!!`
      })
    }

    await EmprestimoLivro.create({
      idEmprestimo: emprestimo.id,
      idLivro: livros[index]
    });
  }
  return res.status (201).send({
    type: 'sucess',
    dados: emprestimo
  })
}


const update = async (id, dados, res) =>{
  let emprestimo = await Emprestimo.findOne({
    where:{
      id
    }
  });

  if (!emprestimo){
    return res.status(400).send({ type: 'error', message: `Não foi encontrada emprestimo com o id ${id}` })
  }

  Object.keys(dados).forEach(field => emprestimo[field] = dados[field])


  await emprestimo.save()
  return res.status(200).send ({
    message: `Emprestimo ${id} atualizada com sucesso`,
    data: emprestimo
  });
}



const deletar = async (req, res) => {
  try {
    let { id } = req.body;
    id = id ? id.toString(): null;
    id = id ? id.replace(/\D/g, '') : null;
    if (!id) {
      return res.status(400).send({
        message: 'Informe um id válido para deletar o emprestimo'
      });
    }

    let emprestimo = await Emprestimo.findOne({
      where: {
        id
      }
    });

    if (!emprestimo) {
      return res.status(400).send({ message: `Não foi encontrada emprestimo com o id ${id}` })
    }

    await emprestimo.destroy();
    return res.status(200).send({
      message: `Emprestimo id ${id} deletada com sucesso`
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
}
const verificarEmprestimo = async (req, res) => {
  let {idLivro} = req.body
  let existe = null

  try {
    existe = await Livro.findOne({
      where: {
        id: idLivro
      }
    })  

    if(!existe){
      return res.status(400).send({
        message: `O livro De codigo ${idLivro} não existe em nosso banco de dados`
      })
    }
  } catch (error) {
    
  }
  
  
  try {
    let livroEmprestimo = await sequelize.query(`
      select
        *
      from emprestimo_livros as el
      join livros as l on (el.id_livro = l.id)
      inner join emprestimos as e on (e.id = el.id_emprestimo)
      where e.devolucao is null and el.id_livro = ${idLivro}
    `)

    console.log(existe.dataValues);

    if(!livroEmprestimo[1].rows.length){
      console.log(livroEmprestimo[1].rows[0]);
      return res.status(200).send([{
        emprestado: false,
        titulo: existe.dataValues.titulo,
        message: `O livro de código ${idLivro} esta disponivel para emprestimo`
      }])
    }

    console.log("aaa");
    console.log(livroEmprestimo[1].rows[0]);
    return res.status(200).send([{
      emprestado: true,
      message: `Livro indisponivel para emprestimo.`,
      Emprestimo: livroEmprestimo[1].rows[0] 
    }])
    
    
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
}

export default{
  getAll,
  getById,
  persistir,
  deletar,
  verificarEmprestimo,
};