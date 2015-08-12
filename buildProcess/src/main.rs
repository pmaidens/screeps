#![allow(non_snake_case)]

extern crate regex;
extern crate hyper;
extern crate rustc_serialize;

use std::ffi::{OsStr};
use std::fs::{self, PathExt, metadata, copy};
use std::path::{Path, PathBuf};
use std::env;
use std::collections::HashMap;
use regex::Regex;
use std::io;
use hyper::Client;
use hyper::header::{Headers, ContentType, Authorization};
use hyper::mime::{Mime, TopLevel, SubLevel, Attr, Value};
use rustc_serialize::json;

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

    move_all_files_to_build(src_dir.as_path(), src_dir.as_path());

    push_build_to_server();
}

fn move_all_files_to_build(dir: &Path, original_path: &Path) -> io::Result<()> {
    let md = metadata(dir.as_os_str()).unwrap();
    if md.is_dir() {
        for entry in try!(fs::read_dir(dir)) {
            let entry = try!(entry);
            if metadata(entry.path().as_os_str()).unwrap().is_dir() {
                try!(move_all_files_to_build(&entry.path(), original_path));
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

fn push_build_to_server<'a>() -> io::Result<()> {
    let gh_token = env::var("GH_TOKEN").unwrap();
    let gh_token_str: &str = &gh_token[..];
    let screeps_email = "peter_maidens@intuit.com".to_string();

    let client = Client::new();
    let mut headers = Headers::new();

    headers.set(ContentType(Mime(TopLevel::Application, SubLevel::Json, vec![(Attr::Charset, Value::Utf8)])));
    headers.set(Authorization(screeps_email + ":" + gh_token_str));

    // let mut body_map = BTreeMap::new();
    let mut modules = HashMap::new();

    let mut build_dir = env::current_dir().unwrap();
    build_dir.pop();
    build_dir.push("build");

    let mut dir = env::current_dir().unwrap();

    for entry in try!(fs::read_dir(build_dir)) {
        let entry = try!(entry);
        // let file_name = entry.path().file_name().unwrap().to_string_lossy().into_owned();
        let  mut read_file_name = entry.path().file_name();
        let mut file_name_value: &OsStr;
        match read_file_name {
            None => {
                continue;
            }
            Some(v) => {
                file_name_value = v;
            }
        }
        let file_name = file_name_value.to_string_lossy().into_owned();
        modules.insert(file_name, "");
    }

    // For each file in build
        // modules.insert(file.name, file.contents);

    /*let res = */client.post("https://screeps.com/api/user/code")
                        .headers(headers)
                        .body("")
                        .send().unwrap();

    // let mut body = String::new();
    // res.read_to_string(&mut body).unwrap();

    // println!("Response: {}", body);

    Ok(())
}
