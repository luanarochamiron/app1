import { addDoc, collection, getDocs, where, query, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./initializeFirebaseServices";

export type CalendarioDataBase = {
	id: string;
	data: string;
	titulo: string;
	descricao: string;
	prioridade: string;
};

export function useCalendarioDataBase() {
	// Criar novo item no Firestore
	async function criar(data: Omit<CalendarioDataBase, "id">) {
		try {
			const resultado = await addDoc(collection(db, "Calendario"), {
				data: data.data,
				titulo: data.titulo,
				descricao: data.descricao,
				prioridade: data.prioridade,
			});
			return resultado.id;
		} catch (error) {
			console.error("Erro ao criar calendário:", error);
			throw error;
		}
	}

	// Buscar documentos que contenham a data informada
	async function analisar(data: string): Promise<CalendarioDataBase[]> {
		try {
			const calendarioRef = collection(db, "Calendario");
			const querySnapshot = await getDocs(calendarioRef);
			const resultados: CalendarioDataBase[] = [];

			querySnapshot.forEach((docSnap) => {
				const item = docSnap.data() as Omit<CalendarioDataBase, "id">;

				// adiciona o ID do Firestore ao objeto
				const calendarioComId: CalendarioDataBase = {
					id: docSnap.id,
					...item,
				};

				if (item.data.includes(data)) {
					resultados.push(calendarioComId);
				}
			});

			return resultados;
		} catch (error) {
			console.error("Erro ao analisar calendário:", error);
			throw error;
		}
	}

	// Atualizar um item
	async function alterar(data: CalendarioDataBase) {
		try {
			const calendarioRef = doc(db, "Calendario", data.id);
			await updateDoc(calendarioRef, {
				data: data.data,
				titulo: data.titulo,
				descricao: data.descricao,
				prioridade: data.prioridade,
			});
			console.log("Calendário atualizado com sucesso.");
		} catch (error) {
			console.error("Erro ao atualizar calendário:", error);
			throw error;
		}
	}

	// Excluir um item
	async function apagar(id: string) {
		try {
			if (!id) {
				throw new Error("ID inválido para exclusão.");
			}

			console.log("ID recebido para exclusão:", id);
			const calendarioRef = doc(db, "Calendario", id);
			await deleteDoc(calendarioRef);
			console.log("Documento excluído com sucesso.");
		} catch (error) {
			console.error("Erro ao excluir documento:", error);
			throw error;
		}
	}

	return { criar, analisar, apagar, alterar };
}
