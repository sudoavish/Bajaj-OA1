function renderTree(node, data, prefix = "") {
    let lines = [];

    const children = Object.keys(data);

    children.forEach((child, index) => {
        const isLast = index === children.length - 1;

        lines.push(
            <div
                key={prefix + child}
                className="tree-line"
            >
                {prefix}
                {isLast ? "└── " : "├── "}
                {child}
            </div>
        );

        lines = lines.concat(
            renderTree(
                child,
                data[child],
                prefix + (isLast ? "    " : "│   ")
            )
        );
    });

    return lines;
}

export default function TreeView({ tree }) {
    const root = Object.keys(tree)[0];

    return (
        <div className="tree-box">
            <div className="tree-line">{root}</div>
            {renderTree(root, tree[root])}
        </div>
    );
}