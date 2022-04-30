Crear Volumen :
docker volume create vol_spain1
docker volume create vol_italy2

Crear Servidor :

docker run -d -p 27101:27017 -v vol_spain1:/data/db --name spain1 mongo mongod --port 27017 --bind_ip_all --shardsvr --replSet "repspain" --dbpath /data/db
docker run -d -p 27001:27017 -v vol_italia2:/data/db --name italy2 mongo mongod --port 27017 --bind_ip_all --shardsvr --replSet "repitaly" --dbpath /data/db

docker exec -it italy2 mongo

Iniciar ReplicaSet :
docker exec -it spain1 mongo
rs.initiate(
  {
    _id: "repspain",
    members: [
      { _id : 0, host : "25.5.185.77:27101" },
      { _id : 1, host : "25.1.213.132:27101" }
    ]
  }
);

cfg = rs.conf();
cfg.members[0].priority = 2;
cfg.members[1].priority = 0.5;
rs.reconfig(cfg);

Crear Árbitro :
docker run -d -p 37101:27017 --name arbspain mongo mongod --port 27017 --replSet "repspain"

Añadir árbitro dentro del servidor principal :
rs.addArb("25.5.185.77:37101");

docker volume create vol_cfg2

Crear container de configuracion :
docker run -d -p 47001:27017 -v vol_cfg2:/data/configdb --name cfg2 mongo mongod --port 27017 --bind_ip_all --configsvr --replSet "repcfg" --dbpath /data/configdb