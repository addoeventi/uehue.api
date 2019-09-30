import { IUser, IProject, IRole } from 'uehue.models';
import { Document } from 'mongoose'

export interface DocumentUser extends Document, IUser {}

export interface DocumentProject extends Document, IProject {}

export interface DocumentRole extends Document, IRole {}
