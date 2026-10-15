// Icons are visuals only; in tests every lucide icon renders nothing.
const Icon = () => null;
module.exports = new Proxy({ __esModule: true }, { get: (target, name) => (name in target ? target[name] : Icon) });
