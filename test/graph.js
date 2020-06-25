const test = require("tape")
const Graph = require("../graph.js")

test("test passes", (t) => {
    t.plan(1)
    t.pass("this test passes")
})

test("instantiation should work", (t) => {
    let graph = Graph()

    t.pass("smoke test doesn't crash :^)")
    t.end()
})

test("adding edges", (t) => {
    let e1 = { src: "alice", dst: "bob", weight: 0.5 }
    let graph = Graph()
    graph.addEdge(e1)

    t.assert(graph.exists("alice"), "alice exists in graph")
    t.equals(graph.outEdges("alice")[0], e1, "alice has 1 out edge")
    t.same(graph.inEdges("alice"), [], "alice has 0 in edges")
    t.assert(graph.exists("bob"), "bob exists in graph")
    t.same(graph.outEdges("bob"), [], "bob has 0 out edges")
    t.equals(graph.inEdges("bob")[0], e1, "bob has 1 in edge")
    t.end()
})

test("adding edges with depth 3", (t) => {
    let edges = [
        { src: "alice", dst: "bob", weight: 0.5 },
        { src: "bob", dst: "carole", weight: 0.5 },
        { src: "carole", dst: "daniel", weight: 0.5 }
    ]
    
    let graph = Graph()
    edges.forEach(graph.addEdge.bind(graph))

    t.equal(graph.getDepth("alice", "alice"), 0, "alice has depth 0")
    t.equal(graph.getDepth("alice", "bob"), 1, "bob has depth 1")
    t.equal(graph.getDepth("alice", "carole"), 2, "carole has depth 2")
    t.equal(graph.getDepth("alice", "daniel"), 3, "daniel has depth 3")
    t.equal(graph.getDepth("alice", "marjory notingraph"), -1, "marjory is not in the graph")
    t.end()
})

test("adding multiple out edges", (t) => {
    let edges = [
       { src: "alice", dst: "bob", weight: 0.5 },
       { src: "alice", dst: "carole", weight: 0.5 }
    ]

    let graph = Graph()
    edges.forEach(graph.addEdge.bind(graph))

    t.equal(graph.outEdges("alice").length, 2, "alice has 2 out edges")
    t.equal(graph.outEdges("bob").length, 0, "bob has 0 out edges")
    t.equal(graph.inEdges("bob").length, 1, "bob has 1 in edge")
    t.equal(graph.outEdges("carole").length, 0, "carole has 0 in edge")
    t.equal(graph.inEdges("carole").length, 1, "carole has 1 in edge")
    t.end()
})

/*
    alice -> bob -> carole -> daniel
*/
test("node should have same depth regardless of processing of edges", (t) => {
    let edges = [
        { src: "carole", dst: "daniel", weight: 0.5 },
        { src: "bob", dst: "carole", weight: 0.5 },
        { src: "alice", dst: "bob", weight: 0.5 },
        { src: "alice", dst: "bea", weight: 0.5 }
    ]
    
    let graph = Graph()
    edges.forEach(graph.addEdge.bind(graph))

    t.equal(graph.getDepth("alice", "alice"), 0, "alice has depth 0")
    t.equal(graph.getDepth("alice", "bob"), 1, "bob has depth 1")
    t.equal(graph.getDepth("alice", "bea"), 1, "bea has depth 1")
    t.equal(graph.getDepth("alice", "carole"), 2, "carole has depth 2")
    t.equal(graph.getDepth("alice", "daniel"), 3, "daniel has depth 3")
    t.equal(graph.getDepth("alice", "marjory notingraph"), -1, "marjory is not in the graph")
    t.end()
})

test("replace edgepair with new weight", (t) => {
    let edges = [
        { src: "alice", dst: "bob", weight: 0.5 }
    ]
    let updatedEdge = { src: "alice", dst: "bob", weight: 1.0 }
    
    let graph = Graph(edges)
    let outEdges = graph.outEdges("alice")
    t.equal(outEdges.length, 1, "alice only has 1 out edge")
    t.equal(outEdges[0].weight, 0.5, "initial out edge has weight 0.5")
    t.equal(outEdges[0].dst, "bob", "edge is from alice to bob")

    graph.addEdge(updatedEdge) // update edge
    outEdges = graph.outEdges("alice")

    t.equal(outEdges.length, 1, "alice only has 1 out edge")
    t.equal(outEdges[0].weight, 1.0, "updated out edge has weight 1.0")
    t.equal(outEdges[0].dst, "bob", "edge is from alice to bob")
    t.end()
})
