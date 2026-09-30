import { Request, Response, Router } from "express";
import prisma from "../prismaClient";
 
const router = Router();
 
 
// CADASTRAR PALESTRANTE
router.post("/", async (req: Request, res: Response) => {
  try {
    const { nome, email } = req.body;
 
    // Verifica se todos os campos foram preenchidos
    if (!nome || !email) {
      return res.status(400).json({
        mensagem: "Todos os campos são obrigatórios"
      });
    }
 
    // Verifica se o e-mail já está cadastrado
    const palestranteExistente = await prisma.palestrante.findUnique({
      where: {
        email
      }
    });
 
    if (palestranteExistente) {
      return res.status(400).json({
        mensagem: "Este e-mail já está cadastrado"
      });
    }
 
    // Cria o palestrante
    const palestrante = await prisma.palestrante.create({
      data: {
        nome,
        email
      }
    });
 
    return res.status(201).json({
      mensagem: "cadastro concluído com sucesso",
      palestrante
    });
 
  } catch (erro) {
    console.error(erro);
 
    return res.status(500).json({
      mensagem: "Erro ao cadastrar palestrante"
    });
  }
});
 
 
// LISTAR PALESTRANTES
router.get("/", async (req: Request, res: Response) => {
  try {
    const palestrantes = await prisma.palestrante.findMany({
      orderBy: {
        nome: "asc"
      }
    });
 
    return res.status(200).json(palestrantes);
 
  } catch (erro) {
    console.error(erro);
 
    return res.status(500).json({
      mensagem: "Erro ao listar palestrantes"
    });
  }
});
 
 
// BUSCAR PALESTRANTE PELO ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
 
    const palestrante = await prisma.palestrante.findUnique({
      where: {
        id
      }
    });
 
    if (!palestrante) {
      return res.status(404).json({
        mensagem: "Palestrante não encontrado"
      });
    }
 
    return res.status(200).json(palestrante);
 
  } catch (erro) {
    console.error(erro);
 
    return res.status(500).json({
      mensagem: "Erro ao buscar palestrante"
    });
  }
});
 
 
// EDITAR PALESTRANTE
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
 
    const { nome, email } = req.body;
 
    // Verifica se todos os campos foram preenchidos
    if (!nome || !email) {
      return res.status(400).json({
        mensagem: "Todos os campos são obrigatórios"
      });
    }
 
    // Verifica se o palestrante existe
    const palestranteExistente = await prisma.palestrante.findUnique({
      where: {
        id
      }
    });
 
    if (!palestranteExistente) {
      return res.status(404).json({
        mensagem: "Palestrante não encontrado"
      });
    }
 
    // Verifica se o novo e-mail já pertence a outro palestrante
    const emailExistente = await prisma.palestrante.findUnique({
      where: {
        email
      }
    });
 
    if (emailExistente && emailExistente.id !== id) {
      return res.status(400).json({
        mensagem: "Este e-mail já está cadastrado"
      });
    }
 
    const palestrante = await prisma.palestrante.update({
      where: {
        id
      },
 
      data: {
        nome,
        email
      }
    });
 
    return res.status(200).json({
      mensagem: "Palestrante atualizado com sucesso",
      palestrante
    });
 
  } catch (erro) {
    console.error(erro);
 
    return res.status(500).json({
      mensagem: "Erro ao atualizar palestrante"
    });
  }
});
 
 
// EXCLUIR PALESTRANTE
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
 
    // Verifica se o palestrante existe
    const palestrante = await prisma.palestrante.findUnique({
      where: {
        id
      }
    });
 
    if (!palestrante) {
      return res.status(404).json({
        mensagem: "Palestrante não encontrado"
      });
    }
 
    // Exclui o palestrante
    await prisma.palestrante.delete({
      where: {
        id
      }
    });
 
    return res.status(200).json({
      mensagem: "Palestrante excluído com sucesso"
    });
 
  } catch (erro) {
    console.error(erro);
 
    return res.status(500).json({
      mensagem: "Erro ao excluir palestrante"
    });
  }
});
 
 
export default router;