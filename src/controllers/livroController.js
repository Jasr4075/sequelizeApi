import Livro from "../models/Livro";
import { Op } from "sequelize";

const getAll = async (req, res) => {
  try {
    const livros = await Livro.findAll({include: ['autor', 'categoria']});
    return res.status(200).send(livros);
  } catch (error) {
    return res.status(500).send({
      message: error.message
    })
  }
}

const getById = async (req, res) => {
  try {
    let { id } = req.params;

    id = id.replace(/\D/g, '');
    if (!id) {
      return res.status(400).send({
        message: 'Informe um id válido para consulta'
      });
    }
    let livro = await Livro.findOne({
        include: ['autor', 'categoria'],
        where: {
            id
        }
    });

    if (!livro) {
      return res.status(400).send({
        message: `Não foi encontrada livro com o id ${id}`
      });
    }

    return res.status(200).send(livro);
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

const getAllDisponiveis = async (req, res) => {
  try{
    let livros = await Livro.findAll();
    let livrosDisponiveis = [];
    for(let livro of livros){
      let emprestimos = await livro.getEmprestimos({
        where: {
          devolucao: {
            [Op.is]: null
          }
        }
      });

      if (!emprestimos.length) {
        livrosDisponiveis.push(livro)
      }
    };

  return res.status(200).send(livrosDisponiveis);
}catch(error){
  return res.status(400).send(error);
}
}

const create = async (dados, res) => {
  let { titulo, sinopse, emprestado, idCategoria, idAutor } = dados;
  
  
  let livro = await Livro.create({
    titulo,
    sinopse,
    emprestado,
    idCategoria,
    idAutor
  });
  return res.status(201).send(livro)
}

const update = async (id, dados, res) => {
  let livro = await Livro.findOne({
    where: {
      id
    }
  });

  if (!livro) {
    return res.status(400).send({ type: 'error', message: `Não foi encontrada livro com o id ${id}` })
  }

  
  Object.keys(dados).forEach(dado => livro[dado] = dados[dado])
  
  await livro.save();
  return res.status(200).send({
    message: `Livro ${id} atualizada com sucesso`,
    data: livro
  });
}

const deletar = async (req, res) => {
  try {
    let { id } = req.body;
    id = id.toString()
    id = id ? id.replace(/\D/g, '') : null;
    if (!id) {
      return res.status(400).send({
        message: 'Informe um id válido para deletar a livro'
      });
    }

    let livro = await Livro.findOne({
      where: {
        id
      }
    });

    if (!livro) {
      return res.status(400).send({ message: `Não foi encontrada livro com o id ${id}` })
    }

    await livro.destroy();
    return res.status(200).send({
      message: `Livro id ${id} deletada com sucesso`
    })
  } catch (error) {
    return res.status(500).send({
      message: error.message
    })
  }
}

export default {
  getAll,
  getById,
  persistir,
  deletar,
  getAllDisponiveis
};