import { Request, Response, Router } from "express";
import prisma from "../prismaClient";
 
const router = Router();
 
 
// CADASTRAR EVENTO
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      nome,
      descricao,
      local,
      palestrantes
    } = req.body;
 
    // Verifica se todos os campos foram preenchidos
    if (
      !nome ||
      !descricao ||
      !local ||
      !palestrantes ||
      palestrantes.length === 0
    ) {
      return res.status(400).json({
        mensagem: "Todos os campos são obrigatórios"
      });
    }
 
    // Cria o evento e relaciona os palestrantes
    const evento = await prisma.evento.create({
      data: {
        nome,
        descricao,
        local,
 
        palestrantes: {
          create: palestrantes.map((palestranteId: number) => ({
            palestrante: {
              connect: {
                id: palestranteId
              }
            }
          }))
        }
      },
 
      include: {
        palestrantes: {
          include: {
            palestrante: true
          }
        }
      }
    });
 
    return res.status(201).json({
      mensagem: "cadastro concluído com sucesso",
      evento
    });
 
  } catch (erro) {
    console.error(erro);
 
    return res.status(500).json({
      mensagem: "Erro ao cadastrar evento"
    });
  }
});
 
 
// LISTAR EVENTOS
router.get("/", async (req: Request, res: Response) => {
  try {
    const eventos = await prisma.evento.findMany({
      include: {
        palestrantes: {
          include: {
            palestrante: true
          }
        }
      },
 
      orderBy: {
        id: "desc"
      }
    });
 
    return res.status(200).json(eventos);
 
  } catch (erro) {
    console.error(erro);
 
    return res.status(500).json({
      mensagem: "Erro ao listar eventos"
    });
  }
});
 
 
// BUSCAR EVENTO PELO ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
 
    const evento = await prisma.evento.findUnique({
      where: {
        id
      },
 
      include: {
        palestrantes: {
          include: {
            palestrante: true
          }
        }
      }
    });
 
    if (!evento) {
      return res.status(404).json({
        mensagem: "Evento não encontrado"
      });
    }
 
    return res.status(200).json(evento);
 
  } catch (erro) {
    console.error(erro);
 
    return res.status(500).json({
      mensagem: "Erro ao buscar evento"
    });
  }
});
 
 
// EDITAR EVENTO
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
 
    const {
      nome,
      descricao,
      local,
      palestrantes
    } = req.body;
 
    // Verifica se todos os campos foram preenchidos
    if (
      !nome ||
      !descricao ||
      !local ||
      !palestrantes ||
      palestrantes.length === 0
    ) {
      return res.status(400).json({
        mensagem: "Todos os campos são obrigatórios"
      });
    }
 
    // Verifica se o evento existe
    const eventoExistente = await prisma.evento.findUnique({
      where: {
        id
      }
    });
 
    if (!eventoExistente) {
      return res.status(404).json({
        mensagem: "Evento não encontrado"
      });
    }
 
    // Remove os palestrantes atuais do evento
    await prisma.eventoPalestrante.deleteMany({
      where: {
        eventoId: id
      }
    });
 
    // Atualiza o evento e adiciona os novos palestrantes
    const evento = await prisma.evento.update({
      where: {
        id
      },
 
      data: {
        nome,
        descricao,
        local,
 
        palestrantes: {
          create: palestrantes.map((palestranteId: number) => ({
            palestrante: {
              connect: {
                id: palestranteId
              }
            }
          }))
        }
      },
 
      include: {
        palestrantes: {
          include: {
            palestrante: true
          }
        }
      }
    });
 
    return res.status(200).json({
      mensagem: "Evento atualizado com sucesso",
      evento
    });
 
  } catch (erro) {
    console.error(erro);
 
    return res.status(500).json({
      mensagem: "Erro ao atualizar evento"
    });
  }
});
 
 
// EXCLUIR EVENTO
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
 
    // Verifica se o evento existe
    const evento = await prisma.evento.findUnique({
      where: {
        id
      }
    });
 
    if (!evento) {
      return res.status(404).json({
        mensagem: "Evento não encontrado"
      });
    }
 
    // Exclui o evento
    await prisma.evento.delete({
      where: {
        id
      }
    });
 
    return res.status(200).json({
      mensagem: "Evento excluído com sucesso"
    });
 
  } catch (erro) {
    console.error(erro);
 
    return res.status(500).json({
      mensagem: "Erro ao excluir evento"
    });
  }
});
 
export default router;