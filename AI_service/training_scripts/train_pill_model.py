
import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader
import time

# Configuration
DATASET_DIR = os.path.join(os.path.dirname(__file__), '../datasets/PharmaceuticalDrugRecognitiondataset')
TRAIN_DIR = os.path.join(DATASET_DIR, 'train')
VAL_DIR = os.path.join(DATASET_DIR, 'test') # Using test as val if val not present
MODEL_SAVE_PATH = os.path.join(os.path.dirname(__file__), '../pill_recognition_model.pth')
NUM_EPOCHS = 5
BATCH_SIZE = 32
LEARNING_RATE = 0.001

def train_model():
    # Check device
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    # Data Transforms
    data_transforms = {
        'train': transforms.Compose([
            transforms.RandomResizedCrop(224),
            transforms.RandomHorizontalFlip(),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
        'val': transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
    }

    # Load Data
    print(f"Loading data from {TRAIN_DIR}...")
    if not os.path.exists(TRAIN_DIR):
        print(f"Error: Train directory not found at {TRAIN_DIR}")
        return

    image_datasets = {
        'train': datasets.ImageFolder(TRAIN_DIR, data_transforms['train']),
        'val': datasets.ImageFolder(VAL_DIR, data_transforms['val']) if os.path.exists(VAL_DIR) else None
    }
    
    dataloaders = {
        'train': DataLoader(image_datasets['train'], batch_size=BATCH_SIZE, shuffle=True, num_workers=0), # num_workers=0 for Windows compatibility
        'val': DataLoader(image_datasets['val'], batch_size=BATCH_SIZE, shuffle=False, num_workers=0) if image_datasets.get('val') else None
    }

    class_names = image_datasets['train'].classes
    print(f"Classes found: {len(class_names)}")
    print(class_names[:5]) # Print first 5 classes

    # Model Setup (ResNet18)
    print("Initializing ResNet18 model...")
    model = models.resnet18(pretrained=True)
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, len(class_names))
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.SGD(model.parameters(), lr=LEARNING_RATE, momentum=0.9)

    # Training Loop
    since = time.time()
    best_acc = 0.0

    for epoch in range(NUM_EPOCHS):
        print(f'Epoch {epoch}/{NUM_EPOCHS - 1}')
        print('-' * 10)

        for phase in ['train', 'val']:
            if phase == 'val' and dataloaders['val'] is None:
                continue

            if phase == 'train':
                model.train()
            else:
                model.eval()

            running_loss = 0.0
            running_corrects = 0

            # Iterate over data
            for inputs, labels in dataloaders[phase]:
                inputs = inputs.to(device)
                labels = labels.to(device)

                optimizer.zero_grad()

                with torch.set_grad_enabled(phase == 'train'):
                    outputs = model(inputs)
                    _, preds = torch.max(outputs, 1)
                    loss = criterion(outputs, labels)

                    if phase == 'train':
                        loss.backward()
                        optimizer.step()

                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            epoch_loss = running_loss / len(image_datasets[phase])
            epoch_acc = running_corrects.double() / len(image_datasets[phase])

            print(f'{phase} Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}')

            # Deep copy the model
            if phase == 'val' and epoch_acc > best_acc:
                best_acc = epoch_acc
                torch.save(model.state_dict(), MODEL_SAVE_PATH)
        
        # Save check point if no val set
        if dataloaders['val'] is None:
             torch.save(model.state_dict(), MODEL_SAVE_PATH)

    time_elapsed = time.time() - since
    print(f'Training complete in {time_elapsed // 60:.0f}m {time_elapsed % 60:.0f}s')
    print(f'Best Val Acc: {best_acc:4f}')
    
    # Save Class Names
    class_names_path = MODEL_SAVE_PATH.replace('.pth', '_classes.txt')
    with open(class_names_path, 'w') as f:
        for c in class_names:
            f.write(f"{c}\n")
    print(f"Saved class names to {class_names_path}")

if __name__ == "__main__":
    train_model()
