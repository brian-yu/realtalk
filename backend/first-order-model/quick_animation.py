import imageio
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation
import argparse
from demo import make_animation
from demo import load_checkpoints
from skimage import img_as_ubyte
from skimage.transform import resize
from IPython.display import HTML
import warnings

parser = argparse.ArgumentParser(
    description="Inference code to lip-sync videos in the wild using Wav2Lip models"
)

parser.add_argument(
    "--input_file_name",
    type=str,
    default=None
)
parser.add_argument(
    "--output_file_name",
    type=str,
    default=None
)

args = parser.parse_args()

warnings.filterwarnings("ignore")
source_image = imageio.imread(args.input_file_name)
reader = imageio.get_reader('lennon.mp4')

#Resize image and video to 256x256
source_image = resize(source_image, (256, 256))[..., :3]

fps = reader.get_meta_data()['fps']
driving_video = []
try:
    for im in reader:
        driving_video.append(im)
except RuntimeError:
    pass
reader.close()

driving_video = [resize(frame, (256, 256))[..., :3] for frame in driving_video]
generator, kp_detector = load_checkpoints(config_path='config/vox-256.yaml', 
                            checkpoint_path='vox-cpk.pth.tar')    
    
predictions = make_animation(source_image, driving_video, generator, kp_detector, relative=True)
#save resulting video
imageio.mimsave('../'+args.output_file_name, [img_as_ubyte(frame) for frame in predictions], fps=fps)