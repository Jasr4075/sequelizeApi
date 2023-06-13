
import { Field } from "pg-protocol/dist/messages";
import Autor from "../models/Autor";

const getAll = async (req, res) => {
  try {
    const autores = await Autor.findAll();
    return res.status(200).send(autores);
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

    let autor = await Autor.findOne({
      where: {
        id
      }
    });

    if (!autor) {
      return res.status(400).send({
        message: `Não foi encontrado autor com o id ${id}`
      });
    }

    return res.status(200).send(autor);
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

const create = async (dados, res) => {
  let { nome, email } = dados;

  let categoriaExistente = await Autor.findOne({
    where: {
      nome
    }
  });

  if (categoriaExistente) {
    return res.status(400).send({
      message: 'este autor já está cadastrado'
    })
  }

  let autor = await Autor.create({
    nome,
    email
  });
  return res.status(201).send(autor)
}

const update = async (id, dados, res) => {
  let autor = await Autor.findOne({
    where: {
      id
    }
  });

  if (!autor) {
    return res.status(400).send({ type: 'error', message: `Não foi encontrado autor com o id ${id}` })
  }

  Object.keys(dados).forEach(dado => autor[dado] = dados[dado])
  
  await autor.save();
  return res.status(200).send({
    message: `Autor ${id} atualizado com sucesso`,
    data: autor
  });
}

const deletar = async (req, res) => {
  try {
    let { id } = req.body;
    id = id.toString()
    id = id ? id.replace(/\D/g, '') : null;
    if (!id) {
      return res.status(400).send({
        message: 'Informe um id válido para deletar a autor'
      });
    }

    let autor = await Autor.findOne({
      where: {
        id
      }
    });

    if (!autor) {
      return res.status(400).send({ message: `Não foi encontrada autor com o id ${id}` })
    }

    await autor.destroy();
    return res.status(200).send({
      message: `Autor id ${id} deletada com sucesso`
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
  deletar
};