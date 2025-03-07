import data_wizard
from .models import Job, Pension, Ending

data_wizard.register(Job)
data_wizard.register(Pension)
data_wizard.register(Ending)