#![allow(non_snake_case)]

extern crate regex;

use std::fs::{self, PathExt, metadata, copy};
use std::path::{Path, PathBuf};
use std::env;
use regex::Regex;
use std::io;

#[allow(unused_must_use)]
fn main() {
    let mut src_dir = env::current_dir().unwrap();
    src_dir.pop();
    src_dir.push("src");

    let mut build_dir = env::current_dir().unwrap();
    build_dir.pop();
    build_dir.push("build");
    fs::create_dir(build_dir);

    println!("The current directory is {}", src_dir.display());

    get_all_relative_paths(src_dir.as_path(), src_dir.as_path());

}

fn get_all_relative_paths(dir: &Path, original_path: &Path) -> io::Result<()> {
    let md = metadata(dir.as_os_str()).unwrap();
    if md.is_dir() {
        for entry in try!(fs::read_dir(dir)) {
            let entry = try!(entry);
            if metadata(entry.path().as_os_str()).unwrap().is_dir() {
                try!(get_all_relative_paths(&entry.path(), original_path));
            } else {
                let relative_path = create_relative_path(entry.path(), original_path);
                let new_file_name = rename_file(relative_path);
                try!(move_file_to_build(entry.path(), new_file_name));
            }
        }
    }
    Ok(())
}

fn create_relative_path(full_path: PathBuf, parent_path: &Path) -> PathBuf {
    let re = Regex::new(parent_path.to_str().unwrap()).unwrap();
    let mut relative_path = re.replace_all(full_path.as_path().to_str().unwrap(), "");
    relative_path.remove(0);
    return PathBuf::from(relative_path);
}

fn rename_file(path: PathBuf) -> String {
    path.as_path().to_string_lossy().replace("/", ".")
}

fn move_file_to_build(original_path: PathBuf, new_file_name: String) -> io::Result<()> {
    println!("Moving {} to {}", original_path.display(), new_file_name);
    let mut to_path = env::current_dir().unwrap();
    to_path.pop();
    to_path.push("build");
    to_path.push(new_file_name);
    try!(fs::copy(original_path, to_path));
    Ok(())
}
