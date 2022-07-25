
enum EnvSignaling {
	PROD_HOST = "ws-signaling.herokuapp.com",
	PROD_PORT = 443,
	LOCAL_HOST = "localhost",
	LOCAL_PORT = 9000
};

enum EnvRoom {
	PROD_HOST = "ws-room-server.herokuapp.com",
	LOCAL_HOST = "http://localhost:5000"
};

export { EnvSignaling, EnvRoom };

