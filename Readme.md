## Uniswap V3 Staker Subgraph

Subgraph to be used by the [UNI V3 Staker Frontend](https://github.com/vbstreetz/uniswap-v3-staker-frontend).

### Examples

- https://thegraph.com/legacy-explorer/subgraph/vbstreetz/witswap-staking (mainnet)
- https://thegraph.com/legacy-explorer/subgraph/vbstreetz/witswap-staking-rinkeby (rinkeby)

### Deployment

1. Create a new subgraph at https://thegraph.com/explorer/subgraph/create. You might want to create an additional one for other testnets e.g. rinkeby
2. Update `package.json` and `Makefile` to match the created subgraphs.
3. Ran `yarn` to install node packages.
4. Deploy e.g. to mainent with `make mainnet`
5. Visit the subgraphs and verify no errors in indexing.

### License

MIT