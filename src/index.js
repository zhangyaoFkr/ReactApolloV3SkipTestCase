import React from "react";
import ReactDOM from "react-dom";
import { HttpLink } from "apollo-link-http";
import { ApolloClient } from "apollo-client";
import { ApolloProvider, graphql, Query, useQuery } from "react-apollo";
import { InMemoryCache } from "apollo-cache-inmemory";
import gql from "graphql-tag";

import "./styles.css";
import { ErrorBoundary } from "./ErrorBundary";

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "https://graphql-pokemon.now.sh/"
  })
});

const pokemonQuery = gql`
  query myPokemon($showOthers: Boolean!, $showAttacks: Boolean!) {
    others: pokemons(first: 3) @include(if: $showOthers) {
      name
    }
    pokemon(name: "Pikachu") {
      id
      name
      attacks @include(if: $showAttacks) {
        fast {
          name
        }
        special {
          name
        }
      }
    }
  }
`;

const PokemonHoc = graphql(pokemonQuery, {
  options: ({ showAttacks, showOthers }) => ({
    variables: {
      showAttacks: Boolean(showAttacks),
      showOthers: Boolean(showOthers)
    }
  }),
  skip: ({ skip }) => Boolean(skip)
})(({ data }) => (
  <pre>
    <code>{JSON.stringify(data, null, 2)}</code>
  </pre>
));

const PokemonRenderProps = ({ showAttacks, showOthers, skip }) => (
  <Query
    query={pokemonQuery}
    skip={Boolean(skip)}
    variables={{
      showAttacks: Boolean(showAttacks),
      showOthers: Boolean(showOthers)
    }}
  >
    {({ data, loading, error }) => (
      <pre>
        <code>{JSON.stringify({ data, loading, error }, null, 2)}</code>
      </pre>
    )}
  </Query>
);

const PokemonHooks = ({ showAttacks, showOthers, skip }) => {
  const { data, loading, error } = useQuery(pokemonQuery, {
    variables: {
      showAttacks: Boolean(showAttacks),
      showOthers: Boolean(showOthers)
    },
    skip: Boolean(skip)
  });

  return (
    <pre>
      <code>{JSON.stringify({ data, loading, error }, null, 2)}</code>
    </pre>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <div className="App">
          <h1>Hello CodeSandbox</h1>
          <h2>Start editing to see some magic happen!</h2>
          <PokemonHoc skip />
        </div>
      </ApolloProvider>
    </ErrorBoundary>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
