import {Router} from 'express'
const router = Router()

router.post('/tesorero/login',(req,res)=>res.send("Login del tesorero"))
router.get('/tesorero/perfil',(req,res)=>res.send("Perfil del tesorero"))
router.get('/aportantes',(req,res)=>res.send("Listar aportantes"))
router.get('/aportante/:id',(req,res)=>res.send("Detalle del aportante"))
router.post('/productos/registro',(req,res)=>res.send("Registrar productos"))
router.put('/producto/actualizar/:id',(req,res)=>res.send("Actualizar producto"))
router.delete('/producto/eliminar/:id',(req,res)=>res.send("Eliminar producto"))

export default router