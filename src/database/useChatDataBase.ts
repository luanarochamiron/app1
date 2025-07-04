import { Timestamp, addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./initializeFirebaseServices";
 
export type ChatMessage = {
    id: string;
    remetente: string;
    destinatario: string;
    mensagem: string;
    dataHora: string;
};
 
export function useChatDataBase() {
    async function enviarMensagem(data: Omit<ChatMessage, "id">) {
        try {
            const resultado = await addDoc(collection(db, "Chat"), {
                remetente: data.remetente.trim().toLowerCase(),
                destinatario: data.destinatario.trim().toLowerCase(),
                mensagem: data.mensagem,
                datahora: Timestamp.fromDate(new Date(data.dataHora)),
            });
 
            return resultado.id;
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            throw error;
        }
    }
 
    async function buscarMensagens(usuarioAtual: string, contato: string) {
        try {
            const mensagensRef = collection(db, "Chat");
 
            const q1 = query(
                mensagensRef,
                where("remetente", "==", usuarioAtual.trim().toLowerCase()),
                where("destinatario", "==", contato.trim().toLowerCase())
            );
 
            const q2 = query(
                mensagensRef,
                where("remetente", "==", contato.trim().toLowerCase()),
                where("destinatario", "==", usuarioAtual.trim().toLowerCase())
            );
 
            const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
 
            const mensagens = [...snap1.docs, ...snap2.docs]
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .sort((a: any, b: any) => {
                    const t1 = a.datahora?.seconds ?? 0;
                    const t2 = b.datahora?.seconds ?? 0;
                    return t1 - t2;
                });
 
            return mensagens;
        } catch (error) {
            console.error("Erro ao buscar mensagens:", error);
            return [];
        }
    }
 
    async function listarConversas(usuario: string) {
        try {
            const mensagensRef = collection(db, "Chat");
 
            const usuarioFormatado = usuario.trim().toLowerCase();
 
            const q1 = query(mensagensRef, where("remetente", "==", usuarioFormatado));
            const q2 = query(mensagensRef, where("destinatario", "==", usuarioFormatado));
 
            const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
 
            const contatosSet = new Set<string>();
 
            snap1.forEach((doc) => {
                const data = doc.data();
                contatosSet.add(data.destinatario?.trim().toLowerCase());
            });
 
            snap2.forEach((doc) => {
                const data = doc.data();
                contatosSet.add(data.remetente?.trim().toLowerCase());
            });
 
            contatosSet.delete(usuarioFormatado);
 
            return Array.from(contatosSet);
        } catch (error) {
            console.error("Erro ao listar conversas:", error);
            return [];
        }
    }
 
    async function listarUsuarios() {
        try {
            const pessoasRef = collection(db, "Usuario");
            const snapshot = await getDocs(pessoasRef);
 
            const usuarios = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    email: data.email?.trim().toLowerCase() || "",
                    nome: data.nome || "",
                    nomeSocial: data.nomeSocial || null,
                };
            });
 
            const usuariosUnicos = Array.from(new Map(usuarios.map((u) => [u.email, u])).values());
            return usuariosUnicos.filter((u) => u.email !== "");
        } catch (error) {
            console.error("Erro ao listar usuários:", error);
            return [];
        }
    }
 
    // ✅ NOVA FUNÇÃO COM RESUMO DAS CONVERSAS
    async function listarUsuariosComResumo(usuarioAtual: string) {
        try {
            const pessoasRef = collection(db, "Usuario");
            const mensagensRef = collection(db, "Chat");
 
            const snapshot = await getDocs(pessoasRef);
            const usuarios = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    email: data.email?.trim().toLowerCase() || "",
                    nome: data.nome || "",
                    nomeSocial: data.nomeSocial || null,
                };
            });
 
            const usuarioFormatado = usuarioAtual.trim().toLowerCase();
 
            const usuariosComResumo = await Promise.all(
                usuarios
                    .filter((u) => u.email !== "" && u.email !== usuarioFormatado)
                    .map(async (u) => {
                        const qRemetente = query(
                            mensagensRef,
                            where("remetente", "==", usuarioFormatado),
                            where("destinatario", "==", u.email)
                        );
 
                        const qDestinatario = query(
                            mensagensRef,
                            where("remetente", "==", u.email),
                            where("destinatario", "==", usuarioFormatado)
                        );
 
                        const [snap1, snap2] = await Promise.all([getDocs(qRemetente), getDocs(qDestinatario)]);
                        const todas = [...snap1.docs, ...snap2.docs];
 
                        const mensagens = todas
                            .map((doc) => ({ id: doc.id, ...doc.data() }))
                            .sort((a: any, b: any) => {
                                const t1 = a.datahora?.seconds ?? 0;
                                const t2 = b.datahora?.seconds ?? 0;
                                return t2 - t1;
                            });
 
                        const ultima = mensagens[0];
                        const ultimaMensagem = ultima?.mensagem || null;
 
                        const naoLidas = snap2.docs.length;
 
                        let horario = "";
                        if (ultima?.datahora?.seconds) {
                            const data = new Date(ultima.datahora.seconds * 1000);
                            const agora = new Date();
                            const hoje = agora.toDateString() === data.toDateString();
                            horario = hoje
                                ? data.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                : data.toLocaleDateString();
                        }
 
                        return {
                            ...u,
                            ultimaMensagem,
                            horario,
                            naoLidas,
                        };
                    })
            );
 
            return usuariosComResumo;
        } catch (error) {
            console.error("Erro ao listar usuários com resumo:", error);
            return [];
        }
    }
 
   
    async function listarUsuarios2() {
        try {
            const pessoasRef = collection(db, "Usuario");
            const snapshot = await getDocs(pessoasRef);
 
            const emails = snapshot.docs.map((doc) => doc.data().email?.trim().toLowerCase()).filter((email) => !!email);
 
            return Array.from(new Set(emails));
        } catch (error) {
            console.error("Erro ao listar usuários:", error);
            return [];
        }
    }
 
    return {
        enviarMensagem,
        buscarMensagens,
        listarConversas,
        listarUsuarios,
        listarUsuarios2,
        listarUsuariosComResumo, // ✅ retorno da nova função
    };
}
 
 