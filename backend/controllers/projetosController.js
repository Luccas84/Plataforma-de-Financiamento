const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Listar todos os projetos
const listarProjetos = async (req, res) => {
  try {
    const projetos = await prisma.projeto.findMany({
      include: {
        criador: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        recompensas: true,
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

    res.json(projetos);
  } catch (error) {
    console.error('Erro ao listar projetos:', error);
    res.status(500).json({ erro: 'Erro ao buscar projetos' });
  }
};

// Buscar projeto por ID
const buscarProjeto = async (req, res) => {
  try {
    const { id } = req.params;

    const projeto = await prisma.projeto.findUnique({
      where: { id: parseInt(id) },
      include: {
        criador: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        recompensas: {
          orderBy: {
            valorMin: 'asc'
          }
        },
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
      }
    });

    if (!projeto) {
      return res.status(404).json({ erro: 'Projeto não encontrado' });
    }

    res.json(projeto);
  } catch (error) {
    console.error('Erro ao buscar projeto:', error);
    res.status(500).json({ erro: 'Erro ao buscar projeto' });
  }
};

// Criar projeto
const criarProjeto = async (req, res) => {
  try {
    const { titulo, descricao, meta, imagem, recompensas } = req.body;
    const criadorId = req.usuarioId;

    if (!titulo || !descricao || !meta || !imagem) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    const projeto = await prisma.projeto.create({
      data: {
        titulo,
        descricao,
        meta: parseFloat(meta),
        imagem,
        criadorId,
        recompensas: recompensas ? {
          create: recompensas.map(r => ({
            descricao: r.descricao,
            valorMin: parseFloat(r.valorMin)
          }))
        } : undefined
      },
      include: {
        criador: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        recompensas: true
      }
    });

    res.status(201).json(projeto);
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    res.status(500).json({ erro: 'Erro ao criar projeto' });
  }
};

// Editar projeto
const editarProjeto = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, meta, imagem } = req.body;
    const usuarioId = req.usuarioId;

    // Verificar se o projeto existe e pertence ao usuário
    const projeto = await prisma.projeto.findUnique({
      where: { id: parseInt(id) }
    });

    if (!projeto) {
      return res.status(404).json({ erro: 'Projeto não encontrado' });
    }

    if (projeto.criadorId !== usuarioId) {
      return res.status(403).json({ erro: 'Você não tem permissão para editar este projeto' });
    }

    const projetoAtualizado = await prisma.projeto.update({
      where: { id: parseInt(id) },
      data: {
        titulo: titulo || projeto.titulo,
        descricao: descricao || projeto.descricao,
        meta: meta ? parseFloat(meta) : projeto.meta,
        imagem: imagem || projeto.imagem
      },
      include: {
        criador: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        recompensas: true
      }
    });

    res.json(projetoAtualizado);
  } catch (error) {
    console.error('Erro ao editar projeto:', error);
    res.status(500).json({ erro: 'Erro ao editar projeto' });
  }
};

// Deletar projeto
const deletarProjeto = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuarioId;

    // Verificar se o projeto existe e pertence ao usuário
    const projeto = await prisma.projeto.findUnique({
      where: { id: parseInt(id) }
    });

    if (!projeto) {
      return res.status(404).json({ erro: 'Projeto não encontrado' });
    }

    if (projeto.criadorId !== usuarioId) {
      return res.status(403).json({ erro: 'Você não tem permissão para deletar este projeto' });
    }

    await prisma.projeto.delete({
      where: { id: parseInt(id) }
    });

    res.json({ mensagem: 'Projeto deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    res.status(500).json({ erro: 'Erro ao deletar projeto' });
  }
};

// Adicionar recompensa
const adicionarRecompensa = async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, valorMin } = req.body;
    const usuarioId = req.usuarioId;

    // Verificar se o projeto existe e pertence ao usuário
    const projeto = await prisma.projeto.findUnique({
      where: { id: parseInt(id) }
    });

    if (!projeto) {
      return res.status(404).json({ erro: 'Projeto não encontrado' });
    }

    if (projeto.criadorId !== usuarioId) {
      return res.status(403).json({ erro: 'Você não tem permissão para adicionar recompensas neste projeto' });
    }

    if (!descricao || !valorMin) {
      return res.status(400).json({ erro: 'Descrição e valor mínimo são obrigatórios' });
    }

    const recompensa = await prisma.recompensa.create({
      data: {
        descricao,
        valorMin: parseFloat(valorMin),
        projetoId: parseInt(id)
      }
    });

    res.status(201).json(recompensa);
  } catch (error) {
    console.error('Erro ao adicionar recompensa:', error);
    res.status(500).json({ erro: 'Erro ao adicionar recompensa' });
  }
};

module.exports = {
  listarProjetos,
  buscarProjeto,
  criarProjeto,
  editarProjeto,
  deletarProjeto,
  adicionarRecompensa
};

