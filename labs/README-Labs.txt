The labs in this directory are provided in a Goolge Colab version and a linux/mac version. The linux/mac versions were tested
in conda environments with setup using the following configurations.

# ---------- MAC SETUP ------------
# Install Brew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# refresh env vars OR open a new terminal
source ~/.zshrc

# install graphviz
brew install graphviz

# MAC conda env setup
conda create --name ml4g python=3.12

conda activate ml4g

pip install --config-settings="--global-option=build_ext" \
            --config-settings="--global-option=-I$(brew --prefix graphviz)/include/" \
            --config-settings="--global-option=-L$(brew --prefix graphviz)/lib/" \
            pygraphviz

pip install torch torchvision torchaudio torch_geometric

pip install torch_scatter torch_sparse torch_cluster torch_spline_conv -f https://data.pyg.org/whl/torch-2.2.0+cpu.html

pip install -U networkx pydot lxml scikit-learn pandas matplotlib seaborn jupyterlab lightning torchmetrics


# ---------- Linux (Palmetto Setup) ----------
conda create --name ml4g python=3.12

source activate ml4g

conda install anaconda::graphviz

pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

pip install torch_geometric

pip install pyg_lib torch_scatter torch_sparse torch_cluster torch_spline_conv -f https://data.pyg.org/whl/torch-2.7.0+cu118.html

pip install -U networkx pygraphviz pydot lxml scikit-learn pandas matplotlib seaborn jupyterlab lightning torchmetrics

python -m ipykernel install --user --name ml4g --display-name ml4g