# cahnge mongo1-sass this name to same as docker service
mongosh --host mongo1-sass:27017 <<EOF
rs.initiate({
  _id: "rs01",
  members: [
    { _id: 0, host: "mongo1-sass:27017" }, 
    { _id: 1, host: "mongo2-sass:27017" },
    { _id: 2, host: "mongo3-sass:27017" }
  ]
})
EOF