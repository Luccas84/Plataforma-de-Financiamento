const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Criar contribuição
const criarContribuicao = async (req, res) => {
  try {
    const { projetoId, valor, recompensaId } = req.body;
    const usuarioId = req.usuarioId;

    if (!projetoId || !valor) {
      return res.status(400).json({ erro: 'Projeto e valor são obrigatórios' });
    }

    // Verificar se o projeto existe
    const projeto = await prisma.projeto.findUnique({
      where: { id: parseInt(projetoId) }
    });

    if (!projeto) {
      return res.status(404).json({ erro: 'Projeto não encontrado' });
    }

    // Se houver recompensa, verificar se existe e se o valor é suficiente
    if (recompensaId) {
      const recompensa = await prisma.recompensa.findUnique({
        where: { id: parseInt(recompensaId) }
      });

      if (!recompensa) {
        return res.status(404).json({ erro: 'Recompensa não encontrada' });
      }

      if (parseFloat(valor) < recompensa.valorMin) {
        return res.status(400).json({ 
          erro: `Valor mínimo para esta recompensa é R$ ${recompensa.valorMin.toFixed(2)}` 
        });
      }
    }

    // Criar contribuição e atualizar valor arrecadado
    const contribuicao = await prisma.$transaction(async (tx) => {
      const novaContribuicao = await tx.contribuicao.create({
        data: {
          valor: parseFloat(valor),
          usuarioId,
          projetoId: parseInt(projetoId),
          recompensaId: recompensaId ? parseInt(recompensaId) : null
        },
        include: {
          usuario: {
            select: {
              id: true,
              nome: true
            }
          },
          recompensa: true
        }
      });

      // Atualizar valor arrecadado do projeto
      await tx.projeto.update({
        where: { id: parseInt(projetoId) },
        data: {
          arrecadado: {
            increment: parseFloat(valor)
          }
        }
      });

      return novaContribuicao;
    });

    res.status(201).json(contribuicao);
  } catch (error) {
    console.error('Erro ao criar contribuição:', error);
    res.status(500).json({ erro: 'Erro ao processar contribuição' });
  }
};

// Buscar contribuições de um projeto
const buscarContribuicoes = async (req, res) => {
  try {
    const { projetoId } = req.params;

    const contribuicoes = await prisma.contribuicao.findMany({
      where: { projetoId: parseInt(projetoId) },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true
          }
        },
        recompensa: true
      },
      orderBy: {
        criadoEm: 'desc'
      }
    });

    res.json(contribuicoes);
  } catch (error) {
    console.error('Erro ao buscar contribuições:', error);
    res.status(500).json({ erro: 'Erro ao buscar contribuições' });
  }
};

// Dashboard do criador
const dashboardCriador = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    // Verificar se o usuário está tentando acessar seu próprio dashboard
    if (parseInt(usuarioId) !== req.usuarioId) {
      return res.status(403).json({ erro: 'Você não tem permissão para acessar este dashboard' });
    }

    const projetos = await prisma.projeto.findMany({
      where: { criadorId: parseInt(usuarioId) },
      include: {
        recompensas: true,
        contribuicoes: {
          include: {
            usuario: {
              select: {
                id: true,
                nome: true
              }
            },
            recompensa: true
          },
          orderBy: {
            criadoEm: 'desc'
          }
        },
        _count: {
          select: {
            contribuicoes: true
          }
        }
      },
      orderBy: {
        criadoEm: 'desc'
      }
    });

    // Calcular estatísticas
    const totalArrecadado = projetos.reduce((sum, p) => sum + p.arrecadado, 0);
    const totalApoiadores = new Set(
      projetos.flatMap(p => p.contribuicoes.map(c => c.usuarioId))
    ).size;

    res.json({
      projetos,
      estatisticas: {
        totalArrecadado,
        totalApoiadores,
        totalProjetos: projetos.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    res.status(500).json({ erro: 'Erro ao buscar dashboard' });
  }
};

module.exports = {
  criarContribuicao,
  buscarContribuicoes,
  dashboardCriador
};

