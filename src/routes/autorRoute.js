
import controller from '../controllers/autorController'

export default (app) => {
	app.post('/autor/deletar', controller.deletar)
	app.get('/autor', controller.getAll)
	app.get('/autor/:id', controller.getById)
	app.post('/autor', controller.persistir)
	app.post('/autor/:id', controller.persistir)
}