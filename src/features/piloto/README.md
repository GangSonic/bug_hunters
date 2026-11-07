# Feature: piloto (pendiente)

Modo piloto con código de participante y registro descargable en CSV. Historia **HU18** (P2, Incremento 4). Responsable: Dafne.

- Se activa solo con `?piloto=1` en la URL.
- Los intentos ya se registran en la máquina de estados de `mision` (`EstadoMision.intentos`); esta feature debe guardarlos por código Pxx y exportarlos.
- Nada sale del navegador salvo la descarga manual (RNF07).
