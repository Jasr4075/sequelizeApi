
import controller from '../controllers/livroController'

export default (app) => {
	app.post('/livro/deletar', controller.deletar)
	app.get('/livro', controller.getAll)
	app.get('/livro/:id', controller.getById)
	app.post('/livro', controller.persistir)
	app.post('/livro/:id', controller.persistir)
	app.get('/livros-disponiveis', controller.getAllDisponiveis)
}