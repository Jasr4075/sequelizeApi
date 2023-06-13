
import controller from '../controllers/usuarioController'

export default (app) => {
	app.post('/usuario/deletar', controller.deletar)
	app.get('/usuario', controller.getAll)
	app.get('/usuario/:id', controller.getById)
	app.post('/usuario', controller.persistir)
	app.post('/usuario/:id', controller.persistir)
}