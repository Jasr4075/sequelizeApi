import autorRoute from './autorRoute';
import categoriasRoute from './categoriasRoute'
import emprestimoRoute from './emprestimoRoute';
import livroRoute from './livroRoute';
import usuarioRoute from './usuarioRoute';


function Routes(app){
    categoriasRoute(app);
    autorRoute(app);
    usuarioRoute(app);
    livroRoute(app);
    emprestimoRoute(app);
}

export default Routes