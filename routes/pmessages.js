const { getPersonalMsg } = require("../controllers/personalmsgControllers");

const router = require("express").Router();

router.param("oid", (req, res, next, id) => {
  req.owner = id;
  console.log("owner", req.owner);
  next();
});
router.param("rid", (req, res, next, id) => {
  req.withUser = id;
  console.log("user", req.withUser);
  next();
});
//get conversation btw two people
router.get("/:oid/:rid", getPersonalMsg);

module.exports = router;
