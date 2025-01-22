{ pkgs ? import <nixpkgs> {} }:

let

in pkgs.mkShell {
    nativeBuildInputs = with pkgs; [ 
        docker
        docker-compose
        nodejs
        nodePackages.npm
    ];
}

