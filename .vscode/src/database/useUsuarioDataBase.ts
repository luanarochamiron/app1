import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { TipoUsuarioEnum } from "../../tipos/enum";
import { db } from "./initializeFirebaseServices";
 
export type PessoasDataBase = {
    id: string;
    cpf: string;
    nome: string;
    nomeSocial: string | null;
    dataNascimento: string;
    email: string;
    senha: string;
    ativo: boolean;
};
 
export type CadastroInicial = {
    cpf: string;
    dataNascimento: string;
};
 
export function useUsuarioDataBase() {
    async function createInicial(data: CadastroInicial) {
        try {
            const resultado = await addDoc(collection(db, "Usuario"), {
                cpf: data.cpf,
                dataNascimento: data.dataNascimento,
            });
 
            return resultado.id;
        } catch (error) {
            throw error;
        }
    }
 
    async function preencherUsuario(data: Omit<PessoasDataBase, "cpf" | "dataNascimento">) {
        try {
            await updateDoc(doc(db, "Usuario", data.id), {
                nome: data.nome,
                nomeSocial: data.nomeSocial,
                email: data.email,
                senha: data.senha,
                tipo: TipoUsuarioEnum.Aluno,
                ativo: true,
                dataCriacao: new Date(),
            });
 
            return data.id;
        } catch (error) {
            throw error;
        }
    }
 
    async function findById(id: string) {
        try {
            const docRef = doc(db, "Usuario", id);
            const docSnap = await getDoc(docRef);
 
            if (docSnap.exists()) {
                const data = docSnap.data();
 
                const usuario: PessoasDataBase = {
                    id: id,
                    cpf: data.cpf,
                    nome: data.nome,
                    nomeSocial: data.nomeSocial ?? null,
                    dataNascimento: data.dataNascimento,
                    email: data.email,
                    senha: data.senha,
                    ativo: data.ativo,
                };
 
                return usuario;
            }
        } catch (error) {
            throw error;
        }
    }
 
    async function findByEmail(email: string): Promise<PessoasDataBase | undefined> {
        try {
            const usuariosRef = collection(db, "Usuario");
            const q = query(usuariosRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);
 
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const data = doc.data();
 
                const usuario: PessoasDataBase = {
                    id: doc.id,
                    cpf: data.cpf,
                    nome: data.nome,
                    nomeSocial: data.nomeSocial ?? null,
                    dataNascimento: data.dataNascimento,
                    email: data.email,
                    senha: data.senha,
                    ativo: data.ativo,
                };
 
                return usuario;
            } else {
                console.log("Nenhum usuário encontrado com esse e-mail.");
                return undefined;
            }
        } catch (error) {
            console.error("Erro no findByEmail:", error);
            throw error;
        }
    }
 
    async function findByCpfEmail(cpf: string, email: string): Promise<PessoasDataBase | undefined> {
        try {
            const usuariosRef = collection(db, "Usuario");
            const q = query(usuariosRef, where("cpf", "==", cpf), where("email", "==", email));
            const querySnapshot = await getDocs(q);
 
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const data = doc.data();
 
                const usuario: PessoasDataBase = {
                    id: doc.id,
                    cpf: data.cpf,
                    nome: data.nome,
                    nomeSocial: data.nomeSocial ?? null,
                    dataNascimento: data.dataNascimento,
                    email: data.email,
                    senha: data.senha,
                    ativo: data.ativo,
                };
 
                return usuario;
            } else {
                console.log("Nenhum usuário encontrado com esse CPF e email.");
                return undefined;
            }
        } catch (error) {
            console.error("Erro no findByCpfEmail:", error);
            throw error;
        }
    }
 
    async function atualizarSenha(cpf: string, novaSenha: string): Promise<void> {
        try {
            const usuariosRef = collection(db, "Usuario");
            const q = query(usuariosRef, where("cpf", "==", cpf));
            const querySnapshot = await getDocs(q);
 
            if (querySnapshot.empty) {
                console.log("Usuário não encontrado para atualizar senha.");
                return;
            }
            const usuarioDoc = querySnapshot.docs[0];
            await updateDoc(doc(db, "Usuario", usuarioDoc.id), {
                senha: novaSenha,
            });
            console.log("Senha atualizada com sucesso.");
        } catch (error) {
            console.error("Erro ao atualizar senha:", error);
            throw error;
        }
    }
    async function buscarUsuarioPorCPF(cpf: string) {
        try {
            const usuariosRef = collection(db, "Usuario");
            const q = query(usuariosRef, where("cpf", "==", cpf));
            const querySnapshot = await getDocs(q);
 
            if (!querySnapshot.empty) {
                return querySnapshot.docs[0].data();
            }
 
            return null;
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
            throw error;
        }
    }
 
    async function atualizarUsuario(cpf: string, dadosAtualizados: any) {
        try {
            const usuariosRef = collection(db, "Usuario");
            const q = query(usuariosRef, where("cpf", "==", cpf));
            const querySnapshot = await getDocs(q);
 
            if (querySnapshot.empty) {
                console.log("Usuário não encontrado.");
                return;
            }
 
            const usuarioDoc = querySnapshot.docs[0];
 
            await updateDoc(doc(db, "Usuario", usuarioDoc.id), dadosAtualizados);
            console.log("Usuário atualizado com sucesso.");
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            throw error;
        }
    }
 
    async function desativarConta(id: string) {
        try {
            const userRef = doc(db, "Usuario", id); // sua coleção se chama 'Usuario'
            await updateDoc(userRef, {
                ativo: false, // ou qualquer outro campo que você use pra indicar conta ativa
            });
            console.log("Conta desativada com sucesso!");
        } catch (error) {
            console.error("Erro ao desativar conta: ", error);
            throw error;
        }
    }
   
    return {
        atualizarUsuario,
        buscarUsuarioPorCPF,
        createInicial,
        preencherUsuario,
        findById,
        findByEmail,
        findByCpfEmail,
        atualizarSenha,
        desativarConta,
    };
}