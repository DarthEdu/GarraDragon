
const loginTesorero = (req,res)=>{
    res.send("Login del tesorero")
}
const perfilTesorero = (req,res)=>{
    res.send("Perfil del tesorero")
}
const listarAportantes = (req,res)=>{
    res.send("Listar aportantes")
}
const detalleAportante = (req,res)=>{
    res.send("Detalle del aportante")
}
const registrarProducto = (req,res)=>{
    res.send("Registrar productos")
}
const actualizarProducto = (req,res)=>{
    res.send("Actualizar producto")
}
const eliminarProducto = (req,res)=>{
    res.send("Eliminar producto")
}

export {
		loginTesorero,
		perfilTesorero,
    listarAportantes,
    detalleAportante,
    registrarProducto,
    actualizarProducto,
    eliminarProducto
}