
import controller from '../controllers/emprestimoController'

export default (app) => {
	app.post('/emprestimo/deletar', controller.deletar)
  app.post('/emprestimo/verificar', controller.verificarEmprestimo)
	app.get('/emprestimo', controller.getAll)
	app.get('/emprestimo/:id', controller.getById)
	app.post('/emprestimo', controller.persistir)
	app.post('/emprestimo/:id', controller.persistir)
    
}