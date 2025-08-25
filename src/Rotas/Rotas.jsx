import { Routes, Route} from 'react-router-dom';
import {Inicial} from '../Paginas/Inicial';
import { Quadro } from '../Componentes/Quadro';
import {CadUsuario} from '../Paginas/CadUsuario';
import { CadTarefa } from '../Paginas/cadTarefa';

export function Rotas(){
    return(
        <Routes>
            <Route path='/' element={<Inicial/>}>
                <Route index element ={<Quadro/>}/>
                <Route path='cadUsuario' element={<CadUsuario/>}/>
                <Route path ='cadTarefa' element={<CadTarefa/>}/>
            </Route>
        </Routes>

    )

}