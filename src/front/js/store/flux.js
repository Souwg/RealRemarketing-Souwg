import Swal from "sweetalert2";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: localStorage.getItem("token") || null,
            user: null,
			uploadedFile: null,
		},
		actions: {
			//action Register user and admin
			signupUser: async (name, last_name, email, password) => {
				try {
					const response = await fetch(`https://studious-palm-tree-7v4xxv5wq5x2pj99-3001.app.github.dev/api/signup`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							name: name,
							last_name: last_name,
							email: email,
							password: password,
						}),
					});

					if (response.ok) {
						const data = await response.json();
						console.log("Usuario registrado:", data.user);
						return data;
					} else {
						const errorData = await response.json();
						console.error("Error en el registro:", errorData.msg);
						return { error: true, msg: errorData.msg }; 
					}
				} catch (error) {
					console.error("Error en el registro:", error);
					return { error: true, msg: "Error en la solicitud" };
				}
			},
			//action login user and admin 
			loginUser: async (email, password) => {
                try {
                    const response = await fetch("https://studious-palm-tree-7v4xxv5wq5x2pj99-3001.app.github.dev/api/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password }),
                    });

                    if (!response.ok) throw new Error("Invalid login credentials");

                    const data = await response.json();
                    localStorage.setItem("token", data.token);
                    setStore({ token: data.token, user: data.user });
                    return true;
                } catch (error) {
                    console.error("Login error:", error);
                    return false;
                }
            },
            logout: () => {
                localStorage.removeItem("token");
                setStore({ token: null, user: null });
            },

			//action upload files
			uploadFile: async (file) => {
				const formData = new FormData();
				formData.append("file", file);
		
				try {
				  const response = await fetch("https://studious-palm-tree-7v4xxv5wq5x2pj99-3001.app.github.dev/api/upload", {
					method: "POST",
					body: formData,
				  });
		
				  if (!response.ok) {
					throw new Error("");
				  }
		
				  const data = await response.json();
				  console.log("Archivo procesado:", data);
		
				  // Almacenar el resultado en el store (opcional)
				  setStore({ uploadedFile: data });
				} catch (error) {
				  console.error(error);
				  console.log("Hubo un error al procesar el archivo.");
				  throw error;
				}
			  },

			  //action delete all files
			  deleteAllFiles: async () => {
				try {
					const response = await fetch("https://studious-palm-tree-7v4xxv5wq5x2pj99-3001.app.github.dev/api/delete-all-files", {
						method: "DELETE",
					});
			
					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.error || "Error desconocido");
					}
			
					const data = await response.json();
				
					console.log("Todos los registros han sido eliminados correctamente.");
				} catch (error) {
					console.error("Error al eliminar los registros:", error.message);
					alert("Hubo un error al intentar eliminar los registros: " + error.message);
				}
			},
			
			//get action files from data
			getAllFiles: async () => {
				try {
					const response = await fetch("https://studious-palm-tree-7v4xxv5wq5x2pj99-3001.app.github.dev/api/files", {
						method: "GET",
					});
			
					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.error || "Error desconocido");
					}
					const data = await response.json();
					return data;
				} catch (error) {
					console.error("Error al obtener la lista de archivos:", error.nessage);
					return [];
				}
			},

			//get action Regrid's API
			getParcelData: async (parcelNumber) => {
				try {
				  const response = await fetch(
					`https://app.regrid.com/api/v2/parcels/apn?parcelnumb=${parcelNumber}&token=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZWdyaWQuY29tIiwiaWF0IjoxNzM2NDQzNDU4LCJleHAiOjE3MzkwMzU0NTgsInUiOjQ4MjQxNSwiZyI6MjMxNTMsImNhcCI6InBhOnRzOnBzOmJmOm1hOnR5OmVvOnpvOnNiIn0.GxFicvA7XmyTh2uIIgJ-HwqN1NT3eQ6NArT1KkbrAT4`
				  );
				  if (!response.ok) {
					throw new Error("Failed to fetch parcel data.");
				  }
				  const data = await response.json();
				  return data;
				} catch (error) {
				  console.error("Error fetching parcel data:", error.message);
				  throw error;
				}
			  },	  
		}
	};
};

export default getState;
