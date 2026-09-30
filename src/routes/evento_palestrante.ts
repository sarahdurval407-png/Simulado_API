import { Request, Response, Router } from "express";
import prisma from "../prismaClient";
 
const router = Router();
 
 
// ADICIONAR PALESTRANTE AO EVENTO
router.post("/", async (req: Request, res: Response) => {
  try {
    const { eventoId, palestranteId } = req.body;
 
    // Verifica se os campos foram preenchidos
    if (!eventoId || !palestranteId) {
      return res.status(400).json({
        mensagem: "Evento e palestrante são obrigatórios"
      });
    }
 
    // Verifica se o evento existe
    const evento = await prisma.evento.findUnique({
      where: {
        id: Number(eventoId)
      }
    });
 
    if (!evento) {
      return res.status(404).json({
        mensagem: "Evento não encontrado"
      });
    }
 
    // Verifica se o palestrante existe
    const palestrante = await prisma.palestrante.findUnique({
      where: {
        id: Number(palestranteId)
      }
    });
 
    if (!palestrante) {
      return res.status(404).json({
        mensagem: "Palestrante não encontrado"
      });
    }
 
    // Verifica se o palestrante já está vinculado ao evento
    const relacaoExistente =
      await prisma.eventoPalestrante.findUnique({
        where: {
          eventoId_palestranteId: {
            eventoId: Number(eventoId),
            palestranteId: Number(palestranteId)
          }
        }
      });
 
    if (relacaoExistente) {
      return res.status(400).json({
        mensagem: "Este palestrante já está vinculado ao evento"
      });
    }
 
    // Cria a relação
    const relacao = await prisma.eventoPalestrante.create({
      data: {
        eventoId: Number(eventoId),
        palestranteId: Number(palestranteId)
      }
    });
 
    return res.status(201).json({
      mensagem: "Palestrante adicionado ao evento",
      relacao
    });
 
  } catch (erro) {
    console.error(erro);
 
    return res.status(500).json({
      mensagem: "Erro ao adicionar palestrante ao evento"
    });
  }
});
 
 
// REMOVER PALESTRANTE DO EVENTO
router.delete(
  "/:eventoId/:palestranteId",
  async (req: Request, res: Response) => {
    try {
      const eventoId = Number(req.params.eventoId);
      const palestranteId = Number(req.params.palestranteId);
 
      // Verifica se a relação existe
      const relacao = await prisma.eventoPalestrante.findUnique({
        where: {
          eventoId_palestranteId: {
            eventoId,
            palestranteId
          }
        }
      });
 
      if (!relacao) {
        return res.status(404).json({
          mensagem: "Palestrante não está vinculado a este evento"
        });
      }
 
      // Remove a relação
      await prisma.eventoPalestrante.delete({
        where: {
          eventoId_palestranteId: {
            eventoId,
            palestranteId
          }
        }
      });
 
      return res.status(200).json({
        mensagem: "Palestrante removido do evento"
      });
 
    } catch (erro) {
      console.error(erro);
 
      return res.status(500).json({
        mensagem: "Erro ao remover palestrante do evento"
      });
    }
  }
);
 
 
export default router;