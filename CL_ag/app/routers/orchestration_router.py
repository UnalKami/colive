from fastapi import APIRouter, Request, HTTPException
import httpx
from app.services.auth_ms_services import register_admin, delete_user, register_conjunto_auth, asociar_usuario_conjunto, delete_conjunto_auth
from app.services.residence_ms_services import register_conjunto, delete_conjunto
router = APIRouter()

@router.post("/registerUserCR")
async def registerUserCR(request: Request):
    print("Iniciando el registro de usuario y conjunto residencial...")
    data = await request.json()
    conjunto_data = data.get("conjunto")
    user_data = data.get("user")
    print(f"Datos recibidos: {data}")
    print(f"Datos del conjunto: {conjunto_data}")
    print(f"Datos del usuario: {user_data}")

    if not conjunto_data or not user_data:
        raise HTTPException(status_code=400, detail="Faltan datos del conjunto o del usuario en el cuerpo de la petición.")

    user_id = None
    conjunto_hash = None

    try:
        # Paso 2: Registrar usuario
        print("Registrando usuario...")
        user_response = await register_admin(user_data)
        user_id = user_response.get("usuarioId")
        if not user_id:
            raise Exception("No se recibió el id del usuario registrado.")
        print(f"Usuario registrado con ID: {user_id}")

        # Paso 3: Registrar conjunto residencial
        print("Registrando conjunto residencial...")
        conjunto_response = await register_conjunto(conjunto_data)
        conjunto_hash = (
            conjunto_response.get("data", {})
            .get("createConjunto", {})
            .get("id")
        )
        if not conjunto_hash:
            # Revertir usuario
            await delete_user(user_id)
            raise Exception("No se recibió el hash del conjunto registrado.")

        print(f"Conjunto registrado con hash: {conjunto_hash}")

        # Paso 4: Registrar conjunto en autenticación
        print("Registrando conjunto en autenticación...")
        auth_conjunto_response = await register_conjunto_auth({
            "hashConjuntoResidencial": str(conjunto_hash),
            "idDuenio": str(user_id)
        })
        print(f"Respuesta de registro en autenticación, paso 4: {auth_conjunto_response}")
        if auth_conjunto_response.status_code != 200:
            # Revertir conjunto y usuario
            #await delete_conjunto(conjunto_hash)
            await delete_user(user_id)
            raise Exception("No se pudo registrar el conjunto en autenticación.")
        print("Conjunto registrado en autenticación exitosamente.")        

        print("Status code:", auth_conjunto_response.status_code)
        print("Raw response text:", await auth_conjunto_response.aread())

        # Si auth_conjunto_response es un objeto httpx.Response:
        data = auth_conjunto_response.json()
        print(f"Datos de la respuesta de autenticación: {data}")
        id_conjunto = data.get("idConjunto")

        print(f"ID del conjunto registrado en autenticación: {id_conjunto}")

        # Paso 4.5: Asociar usuario y conjunto en autenticación
        try:
            asociacion_response = await asociar_usuario_conjunto(
                usuario_id=int(user_id),
                conjunto_residencial_id=int(id_conjunto)
            )
        except Exception as e:
            # Rollback: borrar usuario y conjunto
            await delete_user(user_id)
            #await delete_conjunto(conjunto_hash)
            await delete_conjunto_auth(id_conjunto)
            raise Exception(f"No se pudo asociar usuario y conjunto: {str(e)}")

        # Paso 5: Todo exitoso
        return {
            "success": True,
            "usuarioId": user_id,
            "conjuntoHash": conjunto_hash
        }

    except Exception as e:
        import traceback
        print("Ocurrió un error:", e)
        # Rollback adicional si es necesario
        if conjunto_hash:
            print(f"Error al registrar el conjunto, intentando revertir: {conjunto_hash}")
            #await delete_conjunto(conjunto_hash)
        if user_id:
            await delete_user(user_id)
        raise HTTPException(status_code=500, detail=f"Error en el registro: {str(e)}")